import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Spinner, Stack} from 'react-bootstrap';
import {AdvancedTable, DateTimeInput} from "zavadil-react-common";
import {DateUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {AiLog} from "../../types/AiLog";
import RefreshIconButton from "../general/RefreshIconButton";

const HEADER = [
	{name: 'createdOn', label: 'Created'},
	{name: 'systemPrompt', label: 'systemPrompt'},
	{name: 'userPrompt', label: 'userPrompt'},
	{name: 'response', label: 'response'},
	{name: 'entityType', label: 'entityType'},
	{name: 'operation', label: 'operation'}
];

const DEFAULT_PAGING: PagingRequest = {
	page: 0,
	size: 10,
	sorting: [
		{
			name: 'createdOn',
			desc: true
		}
	]
}

function AiLogList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [from, setFrom] = useState<Date>();
	const [to, setTo] = useState<Date>();
	const [data, setData] = useState<Page<AiLog>>();

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? DEFAULT_PAGING : PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/ai-log/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (l: AiLog) => {
		navigate(`/ai-log/detail/${l.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			setData(undefined);
			restClient
				.aiLog
				.filter(paging, from, to)
				.then(setData)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[from, to, paging, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.page = 0;
			navigateToPage(paging);
			loadPageHandler();
		},
		[paging, navigateToPage, loadPageHandler]
	);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<Form onSubmit={applySearch} className="d-flex align-items-center gap-2">
						<RefreshIconButton onClick={loadPageHandler}/>
						<DateTimeInput
							value={from}
							onChange={setFrom}
						/>
						-
						<DateTimeInput
							value={to}
							onChange={setTo}
						/>
						<Button onClick={applySearch}>Search</Button>
					</Form>
				</Stack>
			</div>

			<div className="d-flex pt-2 px-3 gap-3">
				{
					(data === undefined) ? <span><Spinner/></span>
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
													<td>{DateUtil.formatDateTimeForHumans(item.createdOn)}</td>
													<td>{item.systemPrompt}</td>
													<td>{item.userPrompt}</td>
													<td>{item.response}</td>
													<td>{item.entityType}</td>
													<td>{item.operation}</td>
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

export default AiLogList;
