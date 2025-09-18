import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Table} from 'react-bootstrap';
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {RealmEmbeddingDistance} from "../../types/EmbeddingDistance";
import {TablePlaceholder} from "zavadil-react-common";

export type TopicSimilarRealmsListProps = {
	topicId: number;
}

function TopicSimilarRealmsList({topicId}: TopicSimilarRealmsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Array<RealmEmbeddingDistance>>();

	const navigateToDetail = (d: RealmEmbeddingDistance) => {
		navigate(`/realms/detail/${d.entityId}`);
	}

	const load = useCallback(
		() => {
			restClient
				.realms
				.loadSimilarToTopic(topicId)
				.then(setData)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[topicId, restClient, userAlerts]
	);

	useEffect(load, [topicId]);

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
										<td>{ed.entity.name}</td>
										<td>{ed.entity.summary}</td>
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

export default TopicSimilarRealmsList;
