import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Stack} from 'react-bootstrap';
import {AdvancedTable, TablePlaceholder, TextInputWithReset} from "zavadil-react-common";
import {DateUtil, ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Article} from "../../types/Article";
import RefreshIconButton from "../general/RefreshIconButton";
import IsLockedIcon from "../general/IsLockedIcon";
import {ImagezImageThumb} from "../images/ImagezImage";

const HEADER = [
	{name: '', label: ''},
	{name: 'source.name', label: 'Source'},
	{name: 'processingState', label: 'State'},
	{name: 'title', label: 'Title'},
	{name: 'topic.realm.name', label: 'Realm'},
	{name: 'publishDate', label: 'Published'},
	{name: '', label: ''},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: 'lastUpdatedOn', desc: true}]}

function ArticlesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Article>>();

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/articles/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/articles/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (l: Article) => {
		navigate(`/articles/detail/${l.id}`);
	}

	const applySearch = useCallback(
		(e?: FormEvent) => {
			e && e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging);
		},
		[paging, searchInput, navigateToPage]
	);

	const loadPageHandler = useCallback(
		() => {
			setData(undefined);
			restClient
				.articles
				.loadPage(paging)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={loadPageHandler}/>
					<Button onClick={createNew} className="text-nowrap" disabled={true}>+ Add</Button>
					<div style={{width: '250px'}}>
						<Form onSubmit={applySearch} id="articles-search-form">
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
				</Stack>
			</div>

			<div className="pt-2 px-3">
				{
					(data === undefined) ? <TablePlaceholder/>
						: (
							<AdvancedTable
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={navigateToPage}
								hover={true}
								striped={true}
							>
								{
									(data.totalItems === 0) ? <tr>
											<td colSpan={HEADER.length}>Nothing here...</td>
										</tr> :
										data.content.map(
											(item, index) => {
												return (
													<tr key={index} role="button" onClick={() => navigateToDetail(item)}>
														<td><ImagezImageThumb name={item.mainImage?.name || item.topic?.mainImage?.name}/></td>
														<td>{item.source?.name}</td>
														<td>{item.processingState}</td>
														<td>{item.title}</td>
														<td>{item.topic?.realm?.name}</td>
														<td className="text-nowrap">{DateUtil.formatDateTimeForHumans(item.publishDate)}</td>
														<td><IsLockedIcon locked={item.isLocked}/></td>
													</tr>
												);
											}
										)
								}
							</AdvancedTable>
						)
				}
			</div>
		</div>
	);
}

export default ArticlesList;
