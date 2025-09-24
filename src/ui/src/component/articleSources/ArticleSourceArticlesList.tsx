import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AdvancedTable, TablePlaceholder} from "zavadil-react-common";
import {DateUtil, ObjectUtil, Page, PagingRequest} from "zavadil-ts-common";
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Article} from "../../types/Article";
import {ImagezImageThumb} from "../images/ImagezImage";

export type ArticleSourceArticlesListProps = {
	articleSourceId: number;
}

const HEADER = [
	{name: '', label: ''},
	{name: 'publishDate', label: 'Published'},
	{name: 'processingState', label: 'State'},
	{name: 'title', label: 'Title'},
	{name: 'summary', label: 'Summary'},
	{name: 'topic.articleCountExternal', label: 'Siblings'},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: 'publishDate', desc: true}]}

function ArticleSourceArticlesList({articleSourceId}: ArticleSourceArticlesListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [articles, setArticles] = useState<Page<Article> | null>(null);
	const [paging, setPaging] = useState<PagingRequest>(ObjectUtil.clone(DEFAULT_PAGING));

	const navigateToDetail = (d: Article) => {
		navigate(`/articles/detail/${d.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			restClient
				.articles
				.loadBySource(articleSourceId, paging)
				.then(setArticles)
				.catch((e: Error) => {
					setArticles(null);
					userAlerts.err(e);
				});
		},
		[paging, articleSourceId, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [loadPageHandler]);

	return (
		<div>
			<div className="pt-2 gap-3">
				{
					(articles === null) ? <TablePlaceholder/>
						: (
							<AdvancedTable
								header={HEADER}
								paging={paging}
								totalItems={articles.totalItems}
								onPagingChanged={setPaging}
								hover={true}
								striped={true}
							>
								{
									(articles.totalItems === 0) ? <tr>
											<td colSpan={HEADER.length}>No articles.</td>
										</tr> :
										articles.content.map((article, index) => {
											return (
												<tr key={index} role="button" onClick={() => navigateToDetail(article)}>
													<td><ImagezImageThumb name={article.mainImage?.name || article.topic?.mainImage?.name}/></td>
													<td>{DateUtil.formatDateTimeForHumans(article.publishDate)}</td>
													<td>{article.processingState}</td>
													<td>{article.title}</td>
													<td>{article.summary}</td>
													<td>{article.topic ? article.topic.articleCountExternal : 0}</td>
												</tr>
											);
										})
								}
							</AdvancedTable>
						)
				}
			</div>
		</div>
	);
}

export default ArticleSourceArticlesList;
