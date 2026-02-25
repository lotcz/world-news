import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Stack} from 'react-bootstrap';
import {DateTime, SelectableTableHeader, Switch, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Topic} from "../../types/Topic";
import RefreshIconButton from "../general/RefreshIconButton";
import IsLockedIcon from "../general/IsLockedIcon";
import {ImagezImageThumb} from "../images/ImagezImage";
import InternalArticlesCount from "./badges/InternalArticlesCount";
import ExternalArticlesCount from "./badges/ExternalArticlesCount";
import ExternalSourcesCount from "./badges/ExternalSourcesCount";
import UnusedArticlesCount from "./badges/UnusedArticlesCount";

const HEADER: SelectableTableHeader<Topic> = [
	{name: '', label: '', renderer: (item) => <td><IsLockedIcon locked={item.isLocked}/></td>},
	{
		name: 'mainImageId',
		label: 'Image',
		renderer: (item) => <ImagezImageThumb image={item.mainImage}/>
	},
	{name: 'processingState', label: 'State'},
	{name: 'name', label: 'Name'},
	{name: 'summary', label: 'Summary'},
	{name: 'realm.name', label: 'Realm'},
	{name: 'articleCountInternal', label: 'Internal', renderer: (item) => <InternalArticlesCount topic={item}/>},
	{name: 'articleCountExternal', label: 'External', renderer: (item) => <ExternalArticlesCount topic={item}/>},
	{name: 'externalArticlesSourceCount', label: 'Sources', renderer: (item) => <ExternalSourcesCount topic={item}/>},
	{name: 'externalArticlesUnusedCount', label: 'Unused', renderer: (item) => <UnusedArticlesCount topic={item}/>},
	{name: 'publishDate', label: 'Published', renderer: (item) => <DateTime value={item.publishDate}/>},
	{name: 'lastUpdatedOn', label: 'Updated', renderer: (item) => <DateTime value={item.lastUpdatedOn}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: 'lastUpdatedOn', desc: true}]};

function TopicsList() {
	const {pagingString, published} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Topic> | null>(null);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const onlyPublished = useMemo(
		() => published === 'true',
		[published]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/topics/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest, pub?: boolean) => {
			if (pub === undefined) pub = onlyPublished;
			navigate(`/topics/${PagingUtil.pagingRequestToString(p)}/${pub}`);
		},
		[navigate, onlyPublished]
	);

	const navigateToDetail = (l: Topic) => {
		navigate(`/topics/detail/${l.id}`);
	}

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging);
		},
		[paging, searchInput, navigateToPage]
	);

	const applyPublished = useCallback(
		(pub: boolean) => {
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging, pub);
		},
		[paging, searchInput, navigateToPage]
	);

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.topics
				.search(onlyPublished, paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, restClient, userAlerts, onlyPublished]
	);

	useEffect(loadPageHandler, [paging, onlyPublished]);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={loadPageHandler}/>
					<Button onClick={createNew} className="text-nowrap">+ Add</Button>
					<div style={{width: '250px'}}>
						<Form onSubmit={applySearch} id="topics-search-form">
							<TextInputWithReset
								value={searchInput}
								onChange={setSearchInput}
								onReset={
									() => {
										setSearchInput('');
										navigateToPage(DEFAULT_PAGING);
									}
								}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Search</Button>
					<Switch checked={onlyPublished} onChange={(v) => applyPublished(v)} label="Published" id="published-switch"/>
				</Stack>
			</div>

			<div className="pt-2 px-3 gap-3">
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								showSelect={false}
								header={HEADER}
								paging={paging}
								items={data.content}
								totalItems={data.totalItems}
								onPagingChanged={navigateToPage}
								onClick={navigateToDetail}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}

export default TopicsList;
