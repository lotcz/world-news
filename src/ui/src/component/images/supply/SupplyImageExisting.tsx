import React, {FormEvent, useCallback, useContext, useEffect, useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {Page, PagingRequest} from "zavadil-ts-common";
import {WnRestClientContext} from "../../../client/WnRestClient";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {Image} from "../../../types/Image";
import {ImagezImageThumb} from "../ImagezImage";

const HEADER: SelectableTableHeader<Image> = [
	{name: '', label: '', renderer: (i) => <ImagezImageThumb name={i.name}/>},
	{name: 'description', label: 'Description'},
	{name: 'source', label: 'Source'},
	{name: 'author', label: 'Author'},
	{name: 'filetype', label: 'Type'},
	{name: 'license', label: 'License'},
];

export type SupplyImageExistingProps = {
	search: string;
	onSearchChanged: (search: string) => any;
	onSelected: (image: Image) => any;
}

export default function SupplyImageExisting({onSelected, search, onSearchChanged}: SupplyImageExistingProps) {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Image> | null>(null);
	const [paging, setPaging] = useState<PagingRequest>({page: 0, size: 10});

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.images
				.loadPage(paging)
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
			setPaging({...paging});
		},
		[paging, search]
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
								onReset={() => setPaging({page: 0, size: 0})}
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
								onClick={onSelected}
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={setPaging}
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
