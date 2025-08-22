import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {ArticleSource} from "../../types/ArticleSource";
import {Link} from "react-router";

export type ArticleSourceInfoProps = {
	articleSourceId?: number | null;
}

export default function ArticleSourceInfo({articleSourceId}: ArticleSourceInfoProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState<ArticleSource>();

	useEffect(() => {
		if (articleSourceId) {
			restClient.articleSources.loadSingle(articleSourceId).then(setData);
		} else {
			setData(undefined);
		}
	}, [articleSourceId, restClient]);

	if (!data) return <span>NULL</span>;

	return <Link to={`/article-sources/detail/${articleSourceId}`}>{data.name}</Link>
}
