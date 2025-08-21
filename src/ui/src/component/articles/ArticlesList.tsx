import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Spinner, Stack} from 'react-bootstrap';
import {AdvancedTable, TextInputWithReset} from "zavadil-react-common";
import {DateUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Article} from "../../types/Article";

const HEADER = [
	{name: 'id', label: 'ID'},
	{name: 'title', label: 'Title'},
	{name: 'source.name', label: 'Source'},
	{name: 'processingState', label: 'State'},
	{name: 'topic', label: 'Topic'},
	{name: 'lastUpdatedOn', label: 'Updated'},
	{name: 'createdOn', label: 'Created'}
];

function ArticlesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Article> | null>(null);

	const paging = useMemo(
		() => PagingUtil.pagingRequestFromString(pagingString),
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
			restClient
				.articles
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
													<td>{item.title}</td>
													<td>{item.source?.name}</td>
													<td>{item.processingState}</td>
													<td>{item.topic?.name}</td>
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

export default ArticlesList;
