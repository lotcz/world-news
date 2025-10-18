import React from 'react';
import CountBadge from "../../general/CountBadge";
import {TopicCountProps} from "./InternalArticlesCount";

export default function ExternalSourcesCount({topic}: TopicCountProps) {
	return <CountBadge count={topic.externalArticlesSourceCount} bg="info"/>
}
