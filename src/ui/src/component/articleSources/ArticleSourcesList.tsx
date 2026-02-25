import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Spinner, Stack} from 'react-bootstrap';
import {SelectableTableHeader, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {DateUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleSource} from "../../types/ArticleSource";
import RefreshIconButton from "../general/RefreshIconButton";
import {LanguageIdSelect} from "../languages/LanguageSelect";
import {CountryIdSelect} from "../country/CountrySelect";

const HEADER: SelectableTableHeader<ArticleSource> = [
	{name: 'id', label: 'ID'},
	{name: 'name', label: 'Name'},
	{name: 'processingState', label: 'State'},
	{name: 'language.name', label: 'Language'},
	{name: 'country.name', label: 'Country'},
	{name: 'url', label: 'URL'},
	{name: 'importType', label: 'Import Type'},
	{name: 'articleCount', label: 'Articles'},
	{name: 'lastImported', label: 'Last Imported', renderer: (item) => DateUtil.formatDateTimeForHumans(item.lastImported)}
];

function ArticleSourcesList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<ArticleSource> | null>(null);
	const [countryId, setCountryId] = useState<number | null | undefined>(null);
	const [languageId, setLanguageId] = useState<number | null | undefined>(null);

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? {page: 0, size: 100, sorting: [{name: 'name'}]}
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/article-sources/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/article-sources/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (l: ArticleSource) => {
		navigate(`/article-sources/detail/${l.id}`);
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
				.articleSources
				.loadFiltered(countryId, languageId, paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, restClient, userAlerts, languageId, countryId]
	);

	useEffect(loadPageHandler, [paging, languageId, countryId]);

	const reload = useCallback(
		() => {
			restClient.articleSources.reset();
			loadPageHandler();
		},
		[restClient, loadPageHandler]
	);


	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={reload}/>
					<Button onClick={createNew} className="text-nowrap">+ Add</Button>
					<div style={{width: '250px'}}>
						<Form onSubmit={applySearch}>
							<TextInputWithReset
								value={searchInput}
								onChange={setSearchInput}
								onReset={navigateToPage}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Search</Button>
					<div style={{minWidth: 150}}>
						<LanguageIdSelect
							showEmptyOption={true}
							id={languageId}
							onChange={setLanguageId}
						/>
					</div>
					<div style={{minWidth: 150}}>
						<CountryIdSelect
							showEmptyOption={true}
							id={countryId}
							onChange={setCountryId}
						/>
					</div>
				</Stack>
			</div>

			<div className="d-flex pt-2 px-3 gap-3">
				{
					(data === null) ? <span><Spinner/></span>
						: (
							<TableWithSelect
								showSelect={false}
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								items={data.content}
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

export default ArticleSourcesList;
