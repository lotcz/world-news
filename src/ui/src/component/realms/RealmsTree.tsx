import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Spinner, Table} from 'react-bootstrap';
import {PagingRequest} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Realm, RealmTree} from "../../types/Realm";
import RealmsTreeRow from "./RealmsTreeRow";

const HEADER = [
	{name: 'name', label: 'Name'},
	{name: 'summary', label: 'Summary'},
	{name: 'lastUpdatedOn', label: 'Updated'},
	{name: 'createdOn', label: 'Created'}
];

export type RealmsTreeProps = {
	paging: PagingRequest;
	onItemSelected: (l: Realm) => any;
	onPageRequested: (p: PagingRequest) => any;
}

function RealmsTree({paging, onItemSelected}: RealmsTreeProps) {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<RealmTree | null>(null);

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.realms
				.loadTree()
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});

			// todo: filter using paging.search
		},
		[restClient, userAlerts, paging]
	);

	useEffect(loadPageHandler, [paging]);

	return (
		<div>
			{
				(data === null) ? <span><Spinner/></span>
					: (
						<Table
							hover={true}
							striped={true}
						>
							<thead>
							<tr>
								<th></th>
								{
									HEADER.map(h => <th>{h.label}</th>)
								}
							</tr>
							</thead>
							<tbody>
							<RealmsTreeRow level={0} tree={data} onItemSelected={onItemSelected}/>
							</tbody>
						</Table>
					)
			}
		</div>
	);
}

export default RealmsTree;
