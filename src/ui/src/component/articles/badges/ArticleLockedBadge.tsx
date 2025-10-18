import React from 'react';
import IsLockedIcon from "../../general/IsLockedIcon";
import {ArticleBadgeProps} from "./ArticleBadgeProps";

export default function ArticleLockedBadge({article}: ArticleBadgeProps) {
	return <IsLockedIcon locked={article.isLocked}/>
}
