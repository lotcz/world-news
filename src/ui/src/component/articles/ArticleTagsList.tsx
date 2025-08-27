import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {Link} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Tag} from "../../types/Tag";

export type ArticleTagsListProps = {
	articleId: number;
}

function ArticleTagsList({articleId}: ArticleTagsListProps) {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [tags, setTags] = useState<Array<Tag> | null>(null);

	const load = useCallback(
		() => {
			restClient
				.tags
				.loadByArticle(articleId)
				.then(setTags)
				.catch((e: Error) => {
					setTags(null);
					userAlerts.err(e);
				});
		},
		[articleId, restClient, userAlerts]
	);

	useEffect(load, [articleId]);

	return (
		<div className="d-flex gap-2 align-items-center">
			{
				(tags === null) ? <Spinner/>
					: tags.map(
						(t) => <div>
							<Link to={`/tags/detail/${t.id}`}>{t.name}</Link>
							&nbsp;({t.articleCount})
						</div>
					)
			}
		</div>

	);
}

export default ArticleTagsList;
