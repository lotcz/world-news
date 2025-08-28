import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Spinner, Table} from 'react-bootstrap';
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleEmbeddingDistance} from "../../types/EmbeddingDistance";

export type TopicSimilarArticlesListProps = {
	topicId: number;
}

function TopicSimilarArticlesList({topicId}: TopicSimilarArticlesListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Array<ArticleEmbeddingDistance>>();

	const navigateToDetail = (d: ArticleEmbeddingDistance) => {
		console.log(d.entityId);
		navigate(`/articles/detail/${d.entityId}`);
	}

	const load = useCallback(
		() => {
			restClient
				.articles
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
						<th>Source</th>
						<th>Title</th>
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
										<td>{ed.entity.source?.name}</td>
										<td>{ed.entity.title}</td>
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

export default TopicSimilarArticlesList;
