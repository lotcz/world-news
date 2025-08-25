import React, {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Link} from "react-router";
import {TopicStub} from "../../types/Topic";
import {Stack} from "react-bootstrap";

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

	if (!data) return <span className="fst-italic">NULL</span>;

	return <Stack direction="horizontal" className="align-items-center gap-2">
		<Link to={`/topics/detail/${topicId}`}>{data.name}</Link>
		<span>({data.articleCount})</span>
	</Stack>
}
