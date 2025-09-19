import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AdvancedTable, TablePlaceholder} from "zavadil-react-common";
import {DateUtil, ObjectUtil, Page, PagingRequest, StringUtil} from "zavadil-ts-common";
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {AiLog} from "../../types/AiLog";

export type EntityAiLogListProps = {
	entityId: number;
	entityName: string;
}

const HEADER = [
	{name: 'createdOn', label: 'Timestamp'},
	{name: 'operation', label: 'Operation'},
	{name: 'userPrompt', label: 'User Prompt'},
	{name: 'response', label: 'Response'}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: 'createdOn', desc: true}]}

function EntityAiLogList({entityId, entityName}: EntityAiLogListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [logs, setLogs] = useState<Page<AiLog> | null>(null);
	const [paging, setPaging] = useState<PagingRequest>(ObjectUtil.clone(DEFAULT_PAGING));

	const navigateToDetail = (d: AiLog) => {
		navigate(`/ai-log/detail/${d.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			restClient
				.aiLog
				.loadByEntity(entityName, entityId, paging)
				.then(setLogs)
				.catch((e: Error) => {
					setLogs(null);
					userAlerts.err(e);
				});
		},
		[paging, entityId, entityName, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [loadPageHandler]);

	return (
		<div>
			{
				(logs === null) ? <TablePlaceholder/>
					: (
						<AdvancedTable
							header={HEADER}
							paging={paging}
							totalItems={logs.totalItems}
							onPagingChanged={setPaging}
							hover={true}
							striped={true}
						>
							{
								(logs.totalItems === 0) ? <tr>
										<td colSpan={HEADER.length}>Nothing.</td>
									</tr> :
									logs.content.map((log, index) => {
										return (
											<tr key={index} role="button" onClick={() => navigateToDetail(log)}>
												<td className="text-nowrap">{DateUtil.formatDateTimeForHumans(log.createdOn)}</td>
												<td>{log.operation}</td>
												<td>{StringUtil.ellipsis(log.userPrompt, 100)}</td>
												<td>{StringUtil.ellipsis(log.response, 100)}</td>
											</tr>
										);
									})
							}
						</AdvancedTable>
					)
			}
		</div>
	);
}

export default EntityAiLogList;
