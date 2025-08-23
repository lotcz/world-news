import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Link} from "react-router";
import {TopicStub} from "../../types/Topic";

export type TopicInfoProps = {
	topicId?: number | null;
}

export default function TopicInfo({topicId}: TopicInfoProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState<TopicStub>();

	useEffect(() => {
		if (topicId) {
			restClient.topics.loadSingleStub(topicId).then(setData);
		} else {
			setData(undefined);
		}
	}, [topicId, restClient]);

	if (!data) return <span>NULL</span>;

	return <Link to={`/topics/detail/${topicId}`}>{data.name}</Link>
}
