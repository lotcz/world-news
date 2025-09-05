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
	{name: 'topicCount', label: 'Topics'},
	{name: 'lastUpdatedOn', label: 'Updated'},
	{name: 'createdOn', label: 'Created'}
];

export type RealmsTreeProps = {
	paging: PagingRequest;
	onItemSelected: (l: Realm) => any;
	onPageRequested: (p: PagingRequest) => any;
}

function processTree(tree: RealmTree): number {
	tree.collapsed = true;
	let totalTopics = 0;
	tree.children.forEach(
		t => {
			totalTopics += processTree(t);
		}
	);
	const ownTopics = tree.realm ? tree.realm.topicCount : 0;
	tree.totalTopicCount = ownTopics + totalTopics;
	return tree.totalTopicCount;
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
				.then(
					(tree) => {
						processTree(tree);
						setData(tree);
					}
				)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});

			// todo: jump to item using paging.search
		},
		[restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging, loadPageHandler]);

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
								{
									HEADER.map((h, index) => <th key={index}>{h.label}</th>)
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
