import React from 'react';
import {BsCheck2} from "react-icons/bs";
import {ArticleBadgeProps} from "./ArticleBadgeProps";

export default function ArticleUsedBadge({article}: ArticleBadgeProps) {
	return article.usedForCompilation ? <BsCheck2 color="green"/> : <></>;
}
