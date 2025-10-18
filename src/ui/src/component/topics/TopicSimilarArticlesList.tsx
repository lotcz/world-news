import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Table} from 'react-bootstrap';
import {Link, useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleEmbeddingDistance} from "../../types/EmbeddingDistance";
import {DateTime, IconButton, TablePlaceholder} from "zavadil-react-common";
import ArticleLockedBadge from "../articles/badges/ArticleLockedBadge";
import ArticleUsedBadge from "../articles/badges/ArticleUsedBadge";
import {BsArrowRightSquare, BsArrowUpLeft} from "react-icons/bs";

export type TopicSimilarArticlesListProps = {
	topicId: number;
	onUpdate: () => void;
}

function TopicSimilarArticlesList({topicId, onUpdate}: TopicSimilarArticlesListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Array<ArticleEmbeddingDistance>>();

	const navigateToDetail = (d: ArticleEmbeddingDistance) => {
		navigate(`/articles/detail/${d.entityId}`);
	}

	const load = useCallback(
		() => {
			setData(undefined)
			restClient
				.articles
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

	const moveArticle = useCallback(
		(articleId: number) => {
			restClient
				.articles
				.moveToTopic(articleId, topicId)
				.then(onUpdate)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[onUpdate, topicId, restClient, userAlerts]
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
						<th>Source</th>
						<th></th>
						<th>Title</th>
						<th>Summary</th>
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
										<td>
											<ArticleLockedBadge article={ed.entity}/>
											<ArticleUsedBadge article={ed.entity}/>
										</td>
										<td>{ed.distance}</td>
										<td>{ed.entity.source?.name}</td>
										<td>
											{
												(ed.entity.topic?.id !== topicId) &&
												<IconButton
													icon={<BsArrowUpLeft/>}
													onClick={() => moveArticle(ed.entityId)}
													size="sm"
												>
													<span className="text-nowrap">Move here</span>
												</IconButton>
											}
										</td>
										<td>{ed.entity.title}</td>
										<td>{ed.entity.summary}</td>
										<td><DateTime value={ed.entity.publishDate}/></td>
										<td>
											<Link to={`/articles/detail/${ed.entityId}`}><BsArrowRightSquare/></Link>
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

export default TopicSimilarArticlesList;
