import React, {useMemo} from 'react';
import {RealmTree} from "../../types/Realm";
import {IconButton} from "zavadil-react-common";
import {BiSolidMinusSquare, BiSolidPlusSquare, BiSquare} from "react-icons/bi";
import {Stack} from "react-bootstrap";

export type RealmsTreeRowProps = {
	level: number;
	tree: RealmTree;
	expandedIds: Set<number>;
	onItemSelected: (tree: RealmTree) => any;
	onExpanded: (tree: RealmTree) => any;
	onCollapsed: (tree: RealmTree) => any;
}

function RealmsTreeRow({level, tree, expandedIds, onItemSelected, onExpanded, onCollapsed}: RealmsTreeRowProps) {

	const isExpanded = useMemo(
		() => {
			if (tree.realm === null || !tree.realm.id) return true;
			return expandedIds.has(tree.realm.id);
		},
		[tree, expandedIds]
	);

	return (
		<>
			{
				tree.realm && <tr role="button" onClick={() => onItemSelected(tree)}>
					<td>
						<Stack direction="horizontal" gap={2}>
							<div
								style={{paddingLeft: (level - 1) * 20}}
								onClick={(e) => e.stopPropagation()}
								className="cursor-default"
							>
								{
									tree.children.length > 0 ? <IconButton
											variant="link"
											onClick={() => isExpanded ? onCollapsed(tree) : onExpanded(tree)}
											icon={isExpanded ? <BiSolidMinusSquare/> : <BiSolidPlusSquare/>}
										/>
										: <IconButton variant="link" disabled={true} icon={<BiSquare/>} onClick={() => null}/>
								}
							</div>
							<div>{tree.realm.name}</div>
						</Stack>
					</td>
					<td>{tree.realm.summary}</td>
					<td>{tree.totalTopicCount}</td>
				</tr>
			}
			{
				isExpanded && tree.children.map(
					(r, index) => <RealmsTreeRow
						key={index}
						level={level + 1}
						tree={r}
						expandedIds={expandedIds}
						onItemSelected={onItemSelected}
						onCollapsed={onCollapsed}
						onExpanded={onExpanded}
					/>
				)
			}
		</>
	);
}

export default RealmsTreeRow;
