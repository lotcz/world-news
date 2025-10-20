import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Stack} from 'react-bootstrap';
import {DateTime, LoadingButton, SelectableTableHeader, TablePlaceholder, TableWithSelect} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Topic} from "../../types/Topic";
import RefreshIconButton from "../general/RefreshIconButton";
import {BsCardImage} from "react-icons/bs";

const HEADER: SelectableTableHeader<Topic> = [
	{name: 'processingState', label: 'State', sort: false},
	{name: 'name', label: 'Name', sort: false},
	{name: 'summary', label: 'Summary', sort: false},
	{name: 'realm.name', label: 'Realm', sort: false},
	{name: 'publishDate', label: 'Published', sort: false, renderer: (t) => <DateTime value={t.publishDate}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: 'publishDate'}]};

export default function SupplyTopicImages() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Topic> | null>(null);
	const [selected, setSelected] = useState<Array<Topic>>([]);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/supply-images/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (l: Topic) => {
		navigate(`/topics/detail/${l.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.queues
				.loadTopicSupplyImageQueue(paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[restClient, userAlerts, paging]
	);

	useEffect(loadPageHandler, [paging]);

	const markAsToast = useCallback(
		() => {
			setData(null);
			Promise.all(
				selected.map(
					(t) => restClient
						.topics
						.changeType(Number(t.id), 'Toast')
						.catch((e: Error) => userAlerts.err(e))
				)
			).then(loadPageHandler);
		},
		[restClient, userAlerts, loadPageHandler, selected]
	);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={loadPageHandler}/>
					{
						selected.length > 0 && <>
							<LoadingButton
								variant="secondary"
								loading={data === null}
								icon={<BsCardImage/>}
								onClick={markAsToast}
							>Mark as toasts</LoadingButton>
						</>
					}
				</Stack>
			</div>

			<div className="pt-2 px-3 gap-3">
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={navigateToPage}
								onClick={navigateToDetail}
								onSelect={setSelected}
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
