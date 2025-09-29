import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Stack} from 'react-bootstrap';
import {Elapsed, SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {Website} from "../../types/Website";

const HEADER: SelectableTableHeader<Website> = [
	{name: 'name', label: 'Name'},
	{name: 'url', label: 'Url'},
	{name: 'description', label: 'Description'},
	{name: 'language.name', label: 'Language'},
	{name: 'importLastHeartbeat', label: 'Heartbeat', renderer: (w) => <Elapsed date={w.importLastHeartbeat}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: 'name'}]};

export default function WebsitesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Website> | null>(null);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/websites/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/websites/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (w: Website) => {
		navigate(`/websites/detail/${w.id}`);
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
				.websites
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

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={reload}/>
					<Button onClick={createNew} className="text-nowrap">+ Add</Button>
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

			<div className="pt-2 px-3 gap-3">
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								header={HEADER}
								showSelect={false}
								items={data.content}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={navigateToPage}
								onClick={navigateToDetail}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}

