import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Card, Placeholder} from "react-bootstrap";
import {CacheStatsControl} from "zavadil-react-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {ClientStats} from "../../types/Stats";

function ClientStatsControl() {
	const restClient = useContext(WnRestClientContext);
	const [stats, setStats] = useState<ClientStats>();

	const loadStats = useCallback(
		() => {
			setStats(restClient.getClientStats());
		},
		[restClient]
	);

	useEffect(() => {
		loadStats();
		const h = setInterval(loadStats, 2000);
		return () => clearInterval(h);
	}, []);

	return (
		<Card>
			<Card.Header>
				<Card.Title>Client Stats</Card.Title>
			</Card.Header>
			<Card.Body>
				{
					stats ? <CacheStatsControl name="Languages Cache" stats={stats.languagesCache}/>
						: <Placeholder className="w-100" as="p" animation="glow">
							<Placeholder className="w-100"/>
						</Placeholder>
				}

			</Card.Body>
		</Card>
	);
}

export default ClientStatsControl;
