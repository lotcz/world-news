import React, {useCallback, useContext, useEffect, useState} from 'react';
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Card, Placeholder} from "react-bootstrap";
import {QueueStatsControl} from "zavadil-react-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnStats} from "../../types/Stats";

function QueuesStatsControl() {
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
				<Card.Title>Queues</Card.Title>
			</Card.Header>
			<Card.Body>

				{
					stats ? <QueueStatsControl name="Annotation" stats={stats.annotateQueue}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
				{
					stats ? <QueueStatsControl name="Compilation" stats={stats.compileQueue}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}
			</Card.Body>
		</Card>
	);
}

export default QueuesStatsControl;
