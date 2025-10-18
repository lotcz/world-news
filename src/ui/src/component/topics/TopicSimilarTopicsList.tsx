import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Table} from 'react-bootstrap';
import {Link, useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {TopicEmbeddingDistance} from "../../types/EmbeddingDistance";
import {DateTime, IconButton, TablePlaceholder} from "zavadil-react-common";
import InternalArticlesCount from "./badges/InternalArticlesCount";
import ExternalArticlesCount from "./badges/ExternalArticlesCount";
import ExternalSourcesCount from "./badges/ExternalSourcesCount";
import UnusedArticlesCount from "./badges/UnusedArticlesCount";
import IsLockedIcon from "../general/IsLockedIcon";
import {BsArrowDownRight, BsArrowRightSquare, BsArrowUpLeft} from "react-icons/bs";

export type TopicSimilarTopicsListProps = {
	topicId: number;
	onUpdate: () => void;
}

function TopicsSimilarTopicsList({topicId, onUpdate}: TopicSimilarTopicsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Array<TopicEmbeddingDistance>>();

	const load = useCallback(
		() => {
			restClient
				.topics
				.loadSimilarToTopic(topicId, 20)
				.then(setData)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[topicId, restClient, userAlerts]
	);

	useEffect(load, [topicId]);

	const mergeFromTopic = useCallback(
		(fromTopicId: number) => {
			restClient
				.topics
				.mergeTopics(fromTopicId, topicId)
				.then(onUpdate)
				.catch((e: Error) => userAlerts.err(e));
		},
		[onUpdate, topicId, restClient, userAlerts]
	);

	const mergeToTopic = useCallback(
		(toTopicId: number) => {
			restClient
				.topics
				.mergeTopics(topicId, toTopicId)
				.then(() => navigate(`/topics/detail/${toTopicId}`))
				.catch((e: Error) => userAlerts.err(e));
		},
		[navigate, topicId, restClient, userAlerts]
	);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="d-flex pt-2 gap-3">
				<Table
					striped={true}
				>
					<thead>
					<tr>
						<th></th>
						<th>Distance</th>
						<th>Name</th>
						<th></th>
						<th>Summary</th>
						<th></th>
						<th>Published</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					{
						(data.length === 0) ? <tr>
								<td colSpan={4}>Nothing.</td>
							</tr> :
							data.map((ed, index) => {
								return (
									<tr key={index}>
										<td><IsLockedIcon locked={ed.entity.isLocked}/></td>
										<td>{ed.distance}</td>
										<td>{ed.entity.name}</td>
										<td>
											{
												(ed.entityId !== topicId) &&
												<div className="d-flex flex-column gap-2">
													<IconButton
														icon={<BsArrowUpLeft/>}
														onClick={() => mergeFromTopic(ed.entityId)}
														size="sm"
													>
														<span className="text-nowrap">Merge from</span>
													</IconButton>
													<IconButton
														icon={<BsArrowDownRight/>}
														variant="danger"
														onClick={() => mergeToTopic(ed.entityId)}
														size="sm"
													>
														<span className="text-nowrap">Merge into</span>
													</IconButton>
												</div>
											}
										</td>
										<td>{ed.entity.summary}</td>
										<td>
											<div className="d-flex gap-2">
												<InternalArticlesCount topic={ed.entity}/>
												<ExternalArticlesCount topic={ed.entity}/>
												<ExternalSourcesCount topic={ed.entity}/>
												<UnusedArticlesCount topic={ed.entity}/>
											</div>
										</td>
										<td><DateTime value={ed.entity.publishDate}/></td>
										<td>
											<Link to={`/topics/detail/${ed.entityId}`}><BsArrowRightSquare/></Link>
										</td>
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

export default TopicsSimilarTopicsList;
