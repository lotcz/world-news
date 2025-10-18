import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Stack} from 'react-bootstrap';
import {DateTime, LoadingButton, SelectableTableHeader, TablePlaceholder, TableWithSelect} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Topic} from "../../types/Topic";
import RefreshIconButton from "../general/RefreshIconButton";
import ExternalArticlesCount from "../topics/badges/ExternalArticlesCount";
import InternalArticlesCount from "../topics/badges/InternalArticlesCount";
import ExternalSourcesCount from "../topics/badges/ExternalSourcesCount";
import UnusedArticlesCount from "../topics/badges/UnusedArticlesCount";
import {BsCheck, BsXCircle} from "react-icons/bs";

const HEADER: SelectableTableHeader<Topic> = [
	{name: 'name', label: 'Name'},
	{name: 'summary', label: 'Summary'},
	{name: 'realm.name', label: 'Realm'},
	{name: 'articleCountInternal', label: 'Internal', renderer: (item) => <InternalArticlesCount topic={item}/>},
	{name: 'articleCountExternal', label: 'External', renderer: (item) => <ExternalArticlesCount topic={item}/>},
	{name: 'externalArticlesSourceCount', label: 'Sources', renderer: (item) => <ExternalSourcesCount topic={item}/>},
	{name: 'externalArticlesUnusedCount', label: 'Unused', renderer: (item) => <UnusedArticlesCount topic={item}/>},
	{name: 'lastUpdatedOn', label: 'Updated', renderer: (item) => <DateTime value={item.lastUpdatedOn}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: 'lastUpdatedOn'}]};

export default function ApproveTopicsForCompilation() {
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
			navigate(`/approve-topics/${PagingUtil.pagingRequestToString(p)}`);
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
				.loadTopicApprovalQueue(paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	const approveForCompilation = useCallback(
		() => {
			setData(null);
			Promise.all(
				selected.map(
					(t) => restClient
						.topics
						.approveForCompilation(Number(t.id))
						.catch((e: Error) => userAlerts.err(e))
				)
			).then(loadPageHandler);
		},
		[restClient, userAlerts, loadPageHandler, selected]
	);

	const rejectForCompilation = useCallback(
		() => {
			setData(null);
			Promise.all(
				selected.map(
					(t) => restClient
						.topics
						.rejectForCompilation(Number(t.id))
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
								variant="success"
								loading={data === null}
								icon={<BsCheck/>}
								onClick={approveForCompilation}
							>Approve</LoadingButton>
							<LoadingButton
								variant="secondary"
								loading={data === null}
								icon={<BsXCircle/>}
								onClick={rejectForCompilation}
							>Reject</LoadingButton>
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
								items={data.content}
								totalItems={data.totalItems}
								onPagingChanged={navigateToPage}
								onClick={navigateToDetail}
								onSelect={setSelected}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}
