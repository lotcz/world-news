import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Spinner, Table} from 'react-bootstrap';
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {TopicEmbeddingDistance} from "../../types/EmbeddingDistance";

export type RealmSimilarTopicsListProps = {
	realmId: number;
}

function RealmSimilarTopicsList({realmId}: RealmSimilarTopicsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Array<TopicEmbeddingDistance>>();

	const navigateToDetail = (d: TopicEmbeddingDistance) => {
		console.log(d.entityId);
		navigate(`/topics/detail/${d.entityId}`);
	}

	const load = useCallback(
		() => {
			restClient
				.topics
				.loadSimilarToRealm(realmId)
				.then(setData)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[realmId, restClient, userAlerts]
	);

	useEffect(load, [realmId]);

	if (!data) return <Spinner/>;

	return (
		<div>
			<div className="d-flex pt-2 gap-3">
				<Table
					hover={true}
					striped={true}
				>
					<thead>
					<tr>
						<th>Distance</th>
						<th>Name</th>
						<th>Summary</th>
					</tr>
					</thead>
					<tbody>
					{
						(data.length === 0) ? <tr>
								<td colSpan={4}>Nothing.</td>
							</tr> :
							data.map((ed, index) => {
								return (
									<tr key={index} role="button" onClick={() => navigateToDetail(ed)}>
										<td>{ed.distance}</td>
										<td>{ed.entity?.name}</td>
										<td>{ed.entity?.summary}</td>
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

export default RealmSimilarTopicsList;
