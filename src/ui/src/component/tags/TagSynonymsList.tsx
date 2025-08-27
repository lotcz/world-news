import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {Link} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Tag} from "../../types/Tag";

export type TagSynonymsListProps = {
	tagId: number;
}

function TagSynonymsList({tagId}: TagSynonymsListProps) {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [tags, setTags] = useState<Array<Tag> | null>(null);

	const load = useCallback(
		() => {
			restClient
				.tags
				.loadSynonyms(tagId)
				.then(setTags)
				.catch((e: Error) => {
					setTags(null);
					userAlerts.err(e);
				});
		},
		[tagId, restClient, userAlerts]
	);

	useEffect(load, [tagId]);

	return (
		<div className="d-flex gap-2 align-items-center flex-wrapp">
			{
				(tags === null) ? <Spinner size="sm"/>
					: tags.map(
						(t) => <div className="text-nowrap">
							<Link to={`/tags/detail/${t.id}`}>{t.name}</Link>
							&nbsp;({t.articleCount})
						</div>
					)
			}
		</div>

	);
}

export default TagSynonymsList;
