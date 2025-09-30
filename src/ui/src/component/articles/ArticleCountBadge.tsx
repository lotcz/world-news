import React, {useMemo} from 'react';
import {Badge} from 'react-bootstrap';
import {Variant} from "react-bootstrap/types";

export type ArticleCountBadgeProps = {
	count?: number | null;
	internal?: boolean;
	bg?: Variant;
}

export default function ArticleCountBadge({bg, count, internal}: ArticleCountBadgeProps) {
	const background = useMemo(
		() => {
			if (count === undefined || count === null || count === 0) return 'secondary';
			if (count < 0) return 'danger';
			if (bg !== undefined) return bg;
			return (internal === true) ? 'success' : 'primary';
		},
		[bg, count, internal]
	);

	if (count === undefined || count === null) return <></>;

	return (
		<Badge bg={background}>{count}</Badge>
	);
}
