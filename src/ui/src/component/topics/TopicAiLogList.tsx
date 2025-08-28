import React from 'react';
import EntityAiLogList from "../ailog/EntityAiLogList";

export type TopicAiLogListProps = {
	topicId: number;
}

export default function ArticleAiLogList({topicId}: TopicAiLogListProps) {
	return <EntityAiLogList entityId={topicId} entityName="Topic"/>
}
