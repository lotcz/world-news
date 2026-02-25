import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Stack} from 'react-bootstrap';
import {SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {Country} from "../../types/Country";

const HEADER: SelectableTableHeader<Country> = [
	{name: 'name', label: 'Name'},
	{name: 'createOverview', label: 'Overview', renderer: (item) => item.createOverview ? 'Yes' : 'No'}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: 'name'}]};

export default function CountriesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Country> | null>(null);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/countries/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/countries/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (c: Country) => {
		navigate(`/countries/detail/${c.id}`);
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
				.countries
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

