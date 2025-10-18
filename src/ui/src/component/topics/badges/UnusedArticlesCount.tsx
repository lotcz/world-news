import React from 'react';
import CountBadge from "../../general/CountBadge";
import {TopicCountProps} from "./InternalArticlesCount";

export default function UnusedArticlesCount({topic}: TopicCountProps) {
	return <CountBadge count={topic.externalArticlesUnusedCount} bg="warning"/>
}
