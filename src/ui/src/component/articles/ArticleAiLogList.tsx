import React from 'react';
import EntityAiLogList from "../ailog/EntityAiLogList";

export type ArticleAiLogListProps = {
	articleId: number;
}

export default function ArticleAiLogList({articleId}: ArticleAiLogListProps) {
	return <EntityAiLogList entityId={articleId} entityName="Article"/>
}
