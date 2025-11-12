import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Stack} from 'react-bootstrap';
import {DateTime, LoadingButton, SelectableTableHeader, TablePlaceholder, TableWithSelect} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Article} from "../../types/Article";
import RefreshIconButton from "../general/RefreshIconButton";
import {ImagezImageThumb} from "../images/ImagezImage";
import {BsCheck, BsXCircle} from "react-icons/bs";

const HEADER: SelectableTableHeader<Article> = [
	{
		name: '',
		label: 'Image',
		renderer: (item) => <ImagezImageThumb image={item.mainImage}/>
	},
	{name: 'source.name', label: 'Source'},
	{name: 'processingState', label: 'State'},
	{name: 'title', label: 'Title'},
	{name: 'topic.realm.name', label: 'Realm'},
	{name: 'lastUpdatedOn', label: 'Updated', renderer: (item) => <DateTime value={item.lastUpdatedOn}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: 'lastUpdatedOn'}]}

export default function ApproveArticlesForPublication() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Article>>();
	const [selected, setSelected] = useState<Array<Article>>([]);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/approve-articles/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (l: Article) => {
		navigate(`/articles/detail/${l.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			setData(undefined);
			restClient
				.queues
				.loadArticleApprovalQueue(paging)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	const approveForPublication = useCallback(
		() => {
			setData(undefined);
			Promise.all(
				selected.map(
					(t) => restClient
						.articles
						.approveForPublication(Number(t.id))
						.catch((e: Error) => userAlerts.err(e))
				)
			).then(loadPageHandler);
		},
		[restClient, userAlerts, loadPageHandler, selected]
	);

	const rejectForPublication = useCallback(
		() => {
			setData(undefined);
			Promise.all(
				selected.map(
					(t) => restClient
						.articles
						.rejectForPublication(Number(t.id))
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
								onClick={approveForPublication}
							>Approve</LoadingButton>
							<LoadingButton
								variant="secondary"
								loading={data === null}
								icon={<BsXCircle/>}
								onClick={rejectForPublication}
							>Reject</LoadingButton>
						</>
					}
				</Stack>
			</div>

			<div className="pt-2 px-3">
				{
					(data === undefined) ? <TablePlaceholder/>
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
