import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Table} from 'react-bootstrap';
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Realm} from "../../types/Realm";
import {TablePlaceholder} from "zavadil-react-common";

export type RealmSimilarTopicsListProps = {
	realmId: number;
}

function RealmChildrenList({realmId}: RealmSimilarTopicsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Array<Realm>>();

	const navigateToDetail = (d: Realm) => {
		navigate(`/realms/detail/${d.id}`);
	}

	const load = useCallback(
		() => {
			restClient
				.realms
				.loadChildren(realmId)
				.then(setData)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[realmId, restClient, userAlerts]
	);

	useEffect(load, [realmId]);

	if (!data) return <TablePlaceholder rows={10}/>;

	return (
		<div>
			<div className="d-flex pt-2 gap-3">
				<Table
					hover={true}
					striped={true}
				>
					<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Summary</th>
						<th>Topics</th>
					</tr>
					</thead>
					<tbody>
					{
						(data.length === 0) ? <tr>
								<td colSpan={4}>Nothing.</td>
							</tr> :
							data.map((r, index) => {
								return (
									<tr key={index} role="button" onClick={() => navigateToDetail(r)}>
										<td>{r.id}</td>
										<td>{r.name}</td>
										<td>{r.summary}</td>
										<td>{r.topicCount}</td>
									</tr>
								);
							})
					}
					</tbody>
				</Table>
			</div>
		</div>
	);
}

export default RealmChildrenList;
