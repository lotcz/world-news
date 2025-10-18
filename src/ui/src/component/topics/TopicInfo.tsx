import React, {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Link} from "react-router";
import {TopicStub} from "../../types/Topic";
import {BsArrowRightSquare} from "react-icons/bs";
import InternalArticlesCount from "./badges/InternalArticlesCount";
import ExternalArticlesCount from "./badges/ExternalArticlesCount";
import ExternalSourcesCount from "./badges/ExternalSourcesCount";
import UnusedArticlesCount from "./badges/UnusedArticlesCount";
import {ImagezImageThumb} from "../images/ImagezImage";

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

	return <div className="d-flex align-items-center gap-2">
		<ImagezImageThumb id={data.mainImageId}/>
		<InternalArticlesCount topic={data}/>
		<ExternalArticlesCount topic={data}/>
		<ExternalSourcesCount topic={data}/>
		<UnusedArticlesCount topic={data}/>
		<Link style={{lineHeight: 0}} to={`/topics/detail/${topicId}`}><BsArrowRightSquare size={20}/></Link>
	</div>
}
