import React from 'react';
import {TopicBase} from "../../../types/Topic";
import CountBadge from "../../general/CountBadge";

export type TopicCountProps = {
	topic: TopicBase
}

export default function InternalArticlesCount({topic}: TopicCountProps) {
	return <CountBadge count={topic.articleCountInternal} bg="success"/>
}
