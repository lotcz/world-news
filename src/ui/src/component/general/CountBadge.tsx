import React, {useMemo} from 'react';
import {Badge} from 'react-bootstrap';
import {Variant} from "react-bootstrap/types";

export type CountBadgeProps = {
	count?: number | null;
	bg?: Variant;
}

export default function CountBadge({bg, count}: CountBadgeProps) {
	const background = useMemo(
		() => {
			if (count === undefined || count === null || count === 0) return 'secondary';
			if (count < 0) return 'danger';
			if (bg !== undefined) return bg;
			return 'primary';
		},
		[bg, count]
	);

	if (count === undefined || count === null) return <></>;

	return (
		<Badge bg={background}>{count}</Badge>
	);
}
