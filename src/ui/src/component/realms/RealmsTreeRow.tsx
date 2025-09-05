import React, {useCallback, useMemo, useState} from 'react';
import {DateUtil} from "zavadil-ts-common";
import {Realm, RealmTree} from "../../types/Realm";
import {IconButton} from "zavadil-react-common";
import {BiSolidMinusSquare, BiSolidPlusSquare, BiSquare} from "react-icons/bi";
import {Stack} from "react-bootstrap";

export type RealmsTreeRowProps = {
	level: number;
	tree: RealmTree;
	onItemSelected: (l: Realm) => any;
}

function RealmsTreeRow({level, tree, onItemSelected}: RealmsTreeRowProps) {
	const [data, setData] = useState<RealmTree>({...tree});

	const realm = useMemo(
		() => tree.realm,
		[tree]
	);

	const expanded = useMemo(
		() => data.collapsed === false || realm === null,
		[data, realm]
	);

	const toggleExpanded = useCallback(
		() => {
			data.collapsed = expanded;
			setData({...data});
		},
		[expanded, data]
	);

	return (
		<>
			{
				realm && <tr role="button" onClick={() => onItemSelected(realm)}>
					<td>
						<Stack direction="horizontal" gap={2}>
							<div
								style={{paddingLeft: (level - 1) * 20}}
								onClick={(e) => e.stopPropagation()}
								className="cursor-default"
							>
								{
									data.children.length > 0 ? <IconButton
											variant="link"
											onClick={toggleExpanded}
											icon={expanded ? <BiSolidMinusSquare/> : <BiSolidPlusSquare/>}
										/>
										: <IconButton variant="link" disabled={true} icon={<BiSquare/>} onClick={() => null}/>
								}
							</div>
							<div>{realm.name}</div>
						</Stack>
					</td>
					<td>{realm.summary}</td>
					<td>{data.totalTopicCount}</td>
					<td>{DateUtil.formatDateTimeForHumans(realm.lastUpdatedOn)}</td>
					<td>{DateUtil.formatDateTimeForHumans(realm.createdOn)}</td>
				</tr>
			}
			{
				expanded && data.children.map(
					(r, index) => <RealmsTreeRow key={index} level={level + 1} tree={r} onItemSelected={onItemSelected}/>
				)
			}
		</>
	);
}

export default RealmsTreeRow;
