import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {DateUtil, Page, PagingRequest} from "zavadil-ts-common";
import {AdvancedTable, TablePlaceholder} from "zavadil-react-common";
import {Topic} from "../../types/Topic";

export type RealmTopicsListProps = {
	realmId: number;
}

const HEADER = [
	{name: 'name', label: 'Name'},
	{name: 'summary', label: 'Summary'},
	{name: 'articleCountInternal', label: 'Internal'},
	{name: 'articleCountExternal', label: 'External'},
	{name: 'lastUpdatedOn', label: 'Updated'}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: 'createdOn', desc: true}]}

function RealmTopicsList({realmId}: RealmTopicsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Topic>>();
	const [paging, setPaging] = useState<PagingRequest>(DEFAULT_PAGING);

	const navigateToDetail = (d: Topic) => {
		navigate(`/topics/detail/${d.id}`);
	}

	const load = useCallback(
		() => {
			restClient
				.topics
				.loadByRealm(realmId, paging)
				.then(setData)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[realmId, paging, restClient, userAlerts]
	);

	useEffect(load, [realmId, paging]);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="d-flex pt-2 gap-3">
				<AdvancedTable
					header={HEADER}
					paging={paging}
					totalItems={data.totalItems}
					onPagingChanged={setPaging}
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
										<td>{item.name}</td>
										<td>{item.summary}</td>
										<td>{item.articleCountInternal}</td>
										<td>{item.articleCountExternal}</td>
										<td>{DateUtil.formatDateTimeForHumans(item.lastUpdatedOn)}</td>
									</tr>
								);
							})
					}
				</AdvancedTable>
			</div>
		</div>
	);
}

export default RealmTopicsList;
