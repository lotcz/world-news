import {DateUtil} from "zavadil-ts-common";

export type DurationNsProps = {
	ns?: number | null;
};

function DurationNs({ns}: DurationNsProps) {
	if (ns === undefined || ns === null) return <></>;
	return <span>{DateUtil.formatDuration(ns / 1000000)}</span>;
}

export default DurationNs;
