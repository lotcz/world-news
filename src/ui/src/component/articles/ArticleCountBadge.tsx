import React, {useMemo} from 'react';
import {Variant} from "react-bootstrap/types";
import CountBadge from "../general/CountBadge";

export type ArticleCountBadgeProps = {
	count?: number | null;
	internal?: boolean;
	bg?: Variant;
}

export default function ArticleCountBadge({bg, count, internal}: ArticleCountBadgeProps) {
	const background = useMemo(
		() => {
			if (bg !== undefined) return bg;
			return (internal === true) ? 'success' : 'primary';
		},
		[bg, internal]
	);

	return (
		<CountBadge bg={background} count={count}/>
	);
}
