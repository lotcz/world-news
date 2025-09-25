import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Stack} from 'react-bootstrap';
import {AdvancedTable, TablePlaceholder, TextInputWithReset} from "zavadil-react-common";
import {DateUtil, ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {Image} from "../../types/Image";
import {ImagezImageThumb} from "./ImagezImage";
import {SupplyImageDialogContext} from "../../util/SupplyImageDialogContext";

const HEADER = [
	{name: 'id', label: ''},
	{name: 'name', label: 'Name'},
	{name: 'description', label: 'Description'},
	{name: 'source', label: 'Source'},
	{name: 'author', label: 'Author'},
	{name: 'license', label: 'Internal'},
	{name: 'lastUpdatedOn', label: 'Updated'},
	{name: 'createdOn', label: 'Created'}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: 'lastUpdatedOn', desc: true}]};

export default function ImagesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const supplyImageDialog = useContext(SupplyImageDialogContext);
	const [data, setData] = useState<Page<Image> | null>(null);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/image/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/images/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToId = (id: number) => {
		navigate(`/images/detail/${id}`);
	}

	const navigateToDetail = (i: Image) => {
		if (i.id) navigateToId(i.id);
	}

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging);
		},
		[paging, searchInput, navigateToPage]
	);

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.images
				.loadPage(paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	const reload = useCallback(
		() => {
			setData(null);
			loadPageHandler();
		},
		[loadPageHandler]
	);

	const showImageSupplyDialog = useCallback(
		() => supplyImageDialog.show(
			{
				onClose: () => supplyImageDialog.hide(),
				onSelected: (id) => {
					supplyImageDialog.hide();
					navigateToId(id);
				}
			}
		),
		[supplyImageDialog, navigateToId]
	);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={reload}/>
					<Button onClick={createNew} className="text-nowrap">+ Add</Button>
					<Button onClick={showImageSupplyDialog} className="text-nowrap">Supply...</Button>
					<div style={{width: '250px'}}>
						<Form onSubmit={applySearch} id="topics-search-form">
							<TextInputWithReset
								value={searchInput}
								onChange={setSearchInput}
								onReset={
									() => {
										setSearchInput('');
										navigateToPage(DEFAULT_PAGING);
									}
								}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Search</Button>
				</Stack>
			</div>

			<div className="px-3 gap-3">
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<AdvancedTable
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={navigateToPage}
								hover={true}
								striped={true}
							>
								{
									(data.totalItems === 0) ? <tr>
											<td colSpan={HEADER.length}>Nothing here...</td>
										</tr> :
										data.content.map((item, index) => {
											return (
												<tr key={index} role="button" onClick={() => navigateToDetail(item)}>
													<td><ImagezImageThumb name={item.name}/></td>
													<td>{item.name}</td>
													<td>{item.description}</td>
													<td>{item.source}</td>
													<td>{item.author}</td>
													<td>{item.license}</td>
													<td>{DateUtil.formatDateTimeForHumans(item.lastUpdatedOn)}</td>
													<td>{DateUtil.formatDateTimeForHumans(item.createdOn)}</td>
												</tr>
											);
										})
								}
							</AdvancedTable>
						)
				}
			</div>
		</div>
	);
}

