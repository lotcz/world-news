import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Spinner, Stack} from 'react-bootstrap';
import {AdvancedTable, TextInputWithReset} from "zavadil-react-common";
import {DateUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleSource} from "../../types/ArticleSource";
import RefreshIconButton from "../general/RefreshIconButton";

const HEADER = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Name'},
	{name: 'url', label: 'URL'},
	{name: 'importType', label: 'Import Type'},
	{name: 'articleCount', label: 'Articles'},
	{name: 'lastImported', label: 'Last Imported'},
	{name: 'lastUpdatedOn', label: 'Updated'},
	{name: 'createdOn', label: 'Created'}
];

function ArticleSourcesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<ArticleSource> | null>(null);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? {page: 0, size: 100, sorting: [{name: 'name'}]}
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/article-sources/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/article-sources/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (l: ArticleSource) => {
		navigate(`/article-sources/detail/${l.id}`);
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

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.articleSources
				.loadPage(paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={loadPageHandler}/>
					<Button onClick={createNew} className="text-nowrap">+ Add</Button>
					<div style={{width: '250px'}}>
						<Form onSubmit={applySearch}>
							<TextInputWithReset
								value={searchInput}
								onChange={setSearchInput}
								onReset={navigateToPage}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Search</Button>
				</Stack>
			</div>

			<div className="d-flex pt-2 px-3 gap-3">
				{
					(data === null) ? <span><Spinner/></span>
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
										data.content.map((item, index) => {
											return (
												<tr key={index} role="button" onClick={() => navigateToDetail(item)}>
													<td>{item.id}</td>
													<td>{item.name}</td>
													<td>{item.url}</td>
													<td>{item.importType}</td>
													<td>{item.articleCount}</td>
													<td>{DateUtil.formatDateTimeForHumans(item.lastImported)}</td>
													<td>{DateUtil.formatDateTimeForHumans(item.lastUpdatedOn)}</td>
													<td>{DateUtil.formatDateTimeForHumans(item.createdOn)}</td>
												</tr>
											);
										})
								}
							</AdvancedTable>
						)
				}
			</div>
		</div>
	);
}

export default ArticleSourcesList;
