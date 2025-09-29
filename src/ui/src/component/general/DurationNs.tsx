import {Duration} from "zavadil-react-common";

export type DurationNsProps = {
	ns?: number | null;
};

export default function DurationNs({ns}: DurationNsProps) {
	if (ns === undefined || ns === null) return <></>;
	return <Duration ms={(ns / 1000000)}/>;
}
