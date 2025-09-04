import React, {useCallback, useContext, useEffect, useState} from 'react';
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Button, Card, Stack} from "react-bootstrap";
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
				<Stack direction="horizontal" gap={2}>
					<div className="flex-grow-1">
						<QueueStatsControl name="Source Ingestion" stats={stats?.ingestQueue}/>
					</div>
					<Button size="sm" onClick={startIngestion} disabled={stats?.ingestQueue.state !== 'Idle'}>Start</Button>
				</Stack>
				<QueueStatsControl name="Article Annotation" stats={stats?.annotateQueue}/>
				<QueueStatsControl name="Topic Compilation" stats={stats?.compileQueue}/>
			</Card.Body>
		</Card>
	);
}

export default QueuesStatsControl;
