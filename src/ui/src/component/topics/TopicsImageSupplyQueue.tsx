import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Stack} from 'react-bootstrap';
import {SelectableTableHeader, TablePlaceholder, TableWithSelect} from "zavadil-react-common";
import {DateUtil, Page, PagingRequest} from "zavadil-ts-common";
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Topic} from "../../types/Topic";
import RefreshIconButton from "../general/RefreshIconButton";

const HEADER: SelectableTableHeader<Topic> = [
	{name: 'processingState', label: 'State', sort: false},
	{name: 'name', label: 'Name', sort: false},
	{name: 'summary', label: 'Summary', sort: false},
	{name: 'realm.name', label: 'Realm', sort: false},
	{name: 'articleCountExternal', label: 'External', sort: false},
	{name: 'publishDate', label: 'Published', sort: false, renderer: (t) => DateUtil.formatDateTimeForHumans(t.publishDate)}
];

const DEFAULT_SIZE = 10;
const DEFAULT_PAGING: PagingRequest = {page: 0, size: DEFAULT_SIZE, sorting: [{name: 'publishDate'}]};

export default function TopicsImageSupplyQueue() {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Topic> | null>(null);
	const [size, setSize] = useState<number>(DEFAULT_SIZE);

	const navigateToDetail = (l: Topic) => {
		navigate(`/topics/detail/${l.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			restClient
				.topics
				.loadSupplyImageQueue(10)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[restClient, userAlerts]
	);

	useEffect(loadPageHandler, []);

	const reload = useCallback(
		() => {
			setData(null);
			loadPageHandler();
		},
		[loadPageHandler]
	);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={reload}/>
					<div>Total queue size: {data?.totalItems}</div>
				</Stack>
			</div>

			<div className="pt-2 px-3 gap-3">
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								showSelect={false}
								header={HEADER}
								paging={DEFAULT_PAGING}
								totalItems={data.totalItems}
								onPagingChanged={() => null}
								onClick={navigateToDetail}
								items={data.content}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}
