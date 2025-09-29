import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Spinner, Table} from 'react-bootstrap';
import {NumberUtil, PagingRequest, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Realm, RealmTree} from "../../types/Realm";
import RealmsTreeRow from "./RealmsTreeRow";
import {useSearchParams} from "react-router";

const EXPANDED_PARAM = 'exp';

const HEADER = [
	{name: 'name', label: 'Name'},
	{name: 'summary', label: 'Summary'},
	{name: 'topicCount', label: 'Topics'},
	{name: 'publishDate', label: 'Published'},
	{name: '', label: ''}
];

export type RealmsTreeProps = {
	paging: PagingRequest;
	onItemSelected: (r: Realm) => any;
	onPageRequested: (p: PagingRequest) => any;
}

function processTree(tree: RealmTree): number {
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

function findExpandableIds(tree: RealmTree): Set<number> {
	const result = new Set<number>();
	if (tree.children.length > 0) {
		if (tree.realm?.id) {
			result.add(tree.realm?.id);
		}
		tree.children.forEach(
			t => {
				const ids = findExpandableIds(t);
				ids.forEach((id) => result.add(id));
			}
		);
	}
	return result;
}

function RealmsTree({paging, onItemSelected}: RealmsTreeProps) {
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<RealmTree | null>(null);
	const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set<number>());

	// Load expanded IDs from URL on mount
	useEffect(
		() => {
			const param = searchParams.get(EXPANDED_PARAM);
			if (StringUtil.notBlank(param)) {
				const list: Array<number> = param
					.split("-")
					.map((str) => Number(NumberUtil.parseNumber(str)))
					.filter((n) => !isNaN(n));
				setExpandedIds(new Set(list));
			}
		},
		[]
	);

	// Save expanded IDs to URL when expandedIds change
	useEffect(
		() => {
			if (expandedIds.size > 0) {
				searchParams.set(EXPANDED_PARAM, Array.from(expandedIds).join("-"));
			} else {
				searchParams.delete(EXPANDED_PARAM);
			}
			setSearchParams(searchParams, {replace: true}); // no reload
		},
		[expandedIds]
	);

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

	const onExpanded = useCallback(
		(tree: RealmTree) => {
			if (tree.realm?.id) {
				expandedIds.add(tree.realm.id);
				setExpandedIds(new Set<number>(expandedIds));
			}
		},
		[expandedIds]
	);

	const onCollapsed = useCallback(
		(tree: RealmTree) => {
			if (tree.realm?.id) {
				expandedIds.delete(tree.realm.id);
				setExpandedIds(new Set<number>(expandedIds));
			}
		},
		[expandedIds]
	);

	const expandAll = useCallback(
		() => {
			if (!data) return;
			setExpandedIds(findExpandableIds(data));
		},
		[data]
	);

	const collapseAll = useCallback(
		() => {
			setExpandedIds(new Set<number>());
		},
		[]
	);

	return (
		<div>
			{
				(data === null) ? <span><Spinner/></span>
					: (
						<div>
							<div className="d-flex align-items-center gap-2 mt-2">
								<Button size="sm" onClick={collapseAll}>Collapse all</Button>
								<Button size="sm" onClick={expandAll}>Expand all</Button>
							</div>
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
								<RealmsTreeRow
									level={0}
									tree={data}
									expandedIds={expandedIds}
									onItemSelected={
										(t) => {
											if (t.realm) onItemSelected(t.realm)
										}
									}
									onCollapsed={onCollapsed}
									onExpanded={onExpanded}
								/>
								</tbody>
							</Table>
						</div>
					)
			}
		</div>
	);
}

export default RealmsTree;
