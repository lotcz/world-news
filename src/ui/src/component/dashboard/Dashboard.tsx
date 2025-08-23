import React from 'react';
import ClientStatsControl from './ClientStatsControl';
import MemoryStatsControl from "./MemoryStatsControl";
import {Col, Row} from "react-bootstrap";
import QueuesStatsControl from "./QueuesStatsControl";

function Dashboard() {
	return (
		<div className="p-3 pt-1">
			<h1>Dashboard</h1>
			<Row>
				<Col>
					<MemoryStatsControl/>
					<div className="pt-3">
						<ClientStatsControl/>
					</div>
				</Col>
				<Col>
					<QueuesStatsControl/>
				</Col>
			</Row>
		</div>
	);
}

export default Dashboard;
