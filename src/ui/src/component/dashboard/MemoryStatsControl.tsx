import React, {useCallback, useContext, useEffect, useState} from 'react';
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Card, Placeholder} from "react-bootstrap";
import {CacheStatsControl, JavaHeapControl} from "zavadil-react-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnStats} from "../../types/Stats";

function MemoryStatsControl() {
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
				<Card.Title>Server Memory</Card.Title>
			</Card.Header>
			<Card.Body>
				{
					stats ? <JavaHeapControl stats={stats.javaHeap}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <CacheStatsControl name="Realms Cache" stats={stats.realmCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <CacheStatsControl name="Languages Cache" stats={stats.languageCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <CacheStatsControl name="Article Sources Cache" stats={stats.articleSourceCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
			</Card.Body>
		</Card>
	);
}

export default MemoryStatsControl;
