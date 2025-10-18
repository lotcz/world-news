import React from 'react';
import CountBadge from "../../general/CountBadge";
import {TopicCountProps} from "./InternalArticlesCount";

export default function ExternalArticlesCount({topic}: TopicCountProps) {
	return <CountBadge count={topic.articleCountExternal} bg="primary"/>
}
