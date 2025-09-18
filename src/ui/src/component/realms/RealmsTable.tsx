import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {AdvancedTable} from "zavadil-react-common";
import {DateUtil, Page, PagingRequest} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Realm} from "../../types/Realm";
import IsHiddenIcon from "../general/IsHiddenIcon";

const HEADER = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Name'},
	{name: 'summary', label: 'Summary'},
	{name: 'topicCount', label: 'Topics'},
	{name: 'lastUpdatedOn', label: 'Updated'},
	{name: 'createdOn', label: 'Created'},
	{name: '', label: ''}
];

export type RealmsTableProps = {
	paging: PagingRequest;
	onItemSelected: (l: Realm) => any;
	onPageRequested: (p: PagingRequest) => any;
}

function RealmsTable({paging, onItemSelected, onPageRequested}: RealmsTableProps) {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Realm> | null>(null);

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.realms
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
			{
				(data === null) ? <span><Spinner/></span>
					: (
						<AdvancedTable
							header={HEADER}
							paging={paging}
							totalItems={data.totalItems}
							onPagingChanged={onPageRequested}
							hover={true}
							striped={true}
						>
							{
								(data.totalItems === 0) ? <tr>
										<td colSpan={HEADER.length}>Nothing here...</td>
									</tr> :
									data.content.map((item, index) => {
										return (
											<tr key={index} role="button" onClick={() => onItemSelected(item)}>
												<td>{item.id}</td>
												<td>{item.name}</td>
												<td>{item.summary}</td>
												<td>{item.topicCount}</td>
												<td>{DateUtil.formatDateTimeForHumans(item.lastUpdatedOn)}</td>
												<td>{DateUtil.formatDateTimeForHumans(item.createdOn)}</td>
												<td><IsHiddenIcon hidden={item.isHidden}/></td>
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

export default RealmsTable;
