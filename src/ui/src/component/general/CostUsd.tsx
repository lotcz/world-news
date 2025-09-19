export type CostUsdProps = {
	usd?: number | null;
};

function CostUsd({usd}: CostUsdProps) {
	if (usd === undefined || usd === null) return <></>
	return <span className="text-nowrap">USD {usd}</span>;
}

export default CostUsd;
