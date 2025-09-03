import React, {useCallback, useMemo, useState} from 'react';
import {DateUtil} from "zavadil-ts-common";
import {Realm, RealmTree} from "../../types/Realm";
import {IconButton} from "zavadil-react-common";
import {BiSolidMinusSquare, BiSolidPlusSquare, BiSquare} from "react-icons/bi";

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

	const collapsed = useMemo(
		() => data.collapsed !== false,
		[data]
	);

	const toggleCollapsed = useCallback(
		() => {
			data.collapsed = !collapsed;
			setData({...data});
		},
		[collapsed, data]
	);

	return (
		<>
			{
				realm && <tr role="button" onClick={() => onItemSelected(realm)}>
					<td style={{cursor: 'default', paddingLeft: (level - 1) * 20}} onClick={(e) => e.stopPropagation()}>
						{
							data.children.length > 0 ? <IconButton
									variant="link"
									onClick={toggleCollapsed}
									icon={collapsed ? <BiSolidMinusSquare/> : <BiSolidPlusSquare/>}
								/>
								: <IconButton variant="link" disabled={true} icon={<BiSquare/>} onClick={() => null}/>
						}
					</td>
					<td>{realm.name}</td>
					<td>{realm.summary}</td>
					<td>{DateUtil.formatDateTimeForHumans(realm.lastUpdatedOn)}</td>
					<td>{DateUtil.formatDateTimeForHumans(realm.createdOn)}</td>
				</tr>
			}
			{
				collapsed && data.children.map(
					r => <RealmsTreeRow level={level + 1} tree={r} onItemSelected={onItemSelected}/>
				)
			}
		</>
	);
}

export default RealmsTreeRow;
