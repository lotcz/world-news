import React, {useCallback, useContext, useEffect, useState} from 'react';
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Button, Card} from "react-bootstrap";
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

	const startIngestion = useCallback(
		() => {
			restClient.startIngestion()
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
				<QueueStatsControl name="Ingestion" stats={stats?.ingestQueue}/>
				<Button size="sm" onClick={startIngestion} disabled={stats?.ingestQueue.state !== 'Idle'}>Start</Button>
				<QueueStatsControl name="Annotation" stats={stats?.annotateQueue}/>
				<QueueStatsControl name="Compilation" stats={stats?.compileQueue}/>
			</Card.Body>
		</Card>
	);
}

export default QueuesStatsControl;
