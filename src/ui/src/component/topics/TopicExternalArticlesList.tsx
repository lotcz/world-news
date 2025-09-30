import React, {useCallback, useContext, useEffect, useState} from 'react';
import {DateTime, SelectableTableHeader, TablePlaceholder, TableWithSelect} from "zavadil-react-common";
import {Page, PagingRequest} from "zavadil-ts-common";
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Article} from "../../types/Article";
import IsLockedIcon from "../general/IsLockedIcon";

export type TopicArticlesListProps = {
	topicId: number;
}

const HEADER: SelectableTableHeader<Article> = [
	{name: 'source.name', label: 'Source'},
	{name: 'processingState', label: 'State'},
	{name: 'title', label: 'Title'},
	{name: 'summary', label: 'Summary'},
	{name: 'publishDate', label: 'Published', renderer: (item: Article) => <DateTime value={item.publishDate}/>},
	{name: '', label: '', renderer: (item: Article) => <IsLockedIcon locked={item.isLocked}/>}
];

export default function TopicExternalArticlesList({topicId}: TopicArticlesListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [articles, setArticles] = useState<Page<Article> | null>(null);
	const [paging, setPaging] = useState<PagingRequest>({page: 0, size: 10});

	const navigateToDetail = (d: Article) => {
		navigate(`/articles/detail/${d.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			restClient
				.articles
				.loadExternalByTopic(topicId, paging)
				.then(setArticles)
				.catch((e: Error) => {
					setArticles(null);
					userAlerts.err(e);
				});
		},
		[paging, topicId, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	return (
		<div>
			<div className="d-flex pt-2 gap-3">
				{
					(articles === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								showSelect={false}
								header={HEADER}
								paging={paging}
								totalItems={articles.totalItems}
								onPagingChanged={setPaging}
								items={articles.content}
								onClick={navigateToDetail}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}
