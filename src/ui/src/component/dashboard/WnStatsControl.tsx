import React, {useCallback, useContext, useEffect, useState} from 'react';
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Card, Placeholder} from "react-bootstrap";
import {CacheStatsControl, JavaHeapControl} from "zavadil-react-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnStats} from "../../types/Stats";

function WnStatsControl() {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [stats, setStats] = useState<WnStats>();

	const loadStats = useCallback(
		() => {
			restClient.stats()
				.then(setStats)
				.catch((e) => userAlerts.err(e))
		},
		[restClient, userAlerts]
	);

	useEffect(() => {
		loadStats();
		const h = setInterval(loadStats, 2000);
		return () => clearInterval(h);
	}, []);

	return (
		<Card>
			<Card.Header>
				<Card.Title>Server Stats</Card.Title>
			</Card.Header>
			<Card.Body>
				{
					stats ? <JavaHeapControl stats={stats.javaHeap}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <CacheStatsControl name="Templates Cache" stats={stats.realmCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
			</Card.Body>
		</Card>
	);
}

export default WnStatsControl;
