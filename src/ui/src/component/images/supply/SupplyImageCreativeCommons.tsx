import React, {FormEvent, useCallback, useContext, useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {Page, PagingRequest, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../../client/WnRestClient";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {Image, ImageSearchResult} from "../../../types/Image";
import {Img} from "../Img";

const HEADER: SelectableTableHeader<ImageSearchResult> = [
	{name: '', label: '', renderer: (isr) => <Img url={isr.url} alt={isr.id} maxHeight={85}/>},
	{name: 'title', label: 'Name'},
	{name: 'source', label: 'Source'},
	{name: 'creator', label: 'Creator', renderer: (isr) => StringUtil.ellipsis(isr.creator, 50)},
	{name: 'filetype', label: 'Type'},
	{name: 'license', label: 'License'},
	{name: 'width', label: 'Width'},
	{name: 'height', label: 'Height'}
];

export type SupplyImageCreativeCommonsProps = {
	keywords?: Array<string> | null;
	search: string;
	onSearchChanged: (search: string) => any;
	paging: PagingRequest;
	onPagingChanged: (p: PagingRequest) => any;
	onSelected: (image: Image) => any;
}

function SupplyImageCreativeCommons({onSelected, search, onSearchChanged, paging, onPagingChanged}: SupplyImageCreativeCommonsProps) {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<ImageSearchResult> | null>(null);

	const selectImage = (i: ImageSearchResult) => {
		onSelected(
			{
				originalUrl: i.url,
				name: '',
				description: i.title,
				source: i.source,
				author: i.creator,
				license: i.license,
				isAiGenerated: false
			}
		);
	}

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.images
				.searchCreativeCommons(paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, userAlerts, restClient]
	);

	useEffect(loadPageHandler, [paging]);

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = search;
			paging.page = 0;
			onPagingChanged({...paging});
		},
		[paging, search, onPagingChanged]
	);

	return (
		<div>
			<div className="d-flex justify-content-center">
				<div className="d-flex gap-2">
					<div style={{width: '450px'}}>
						<Form onSubmit={applySearch}>
							<TextInputWithReset
								value={search}
								onChange={onSearchChanged}
								onReset={() => onPagingChanged({page: 0, size: 0})}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Search</Button>
				</div>
			</div>
			<div>
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								showSelect={false}
								onClick={selectImage}
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={onPagingChanged}
								items={data.content}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}

export default SupplyImageCreativeCommons;
