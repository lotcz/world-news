import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Stack} from 'react-bootstrap';
import {DateTime, SelectableTableHeader, Switch, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Article} from "../../types/Article";
import RefreshIconButton from "../general/RefreshIconButton";
import {ImagezImageThumb} from "../images/ImagezImage";
import ArticleUsedBadge from "./badges/ArticleUsedBadge";
import ArticleLockedBadge from "./badges/ArticleLockedBadge";

const HEADER: SelectableTableHeader<Article> = [
	{
		name: '',
		label: '',
		renderer: (item) => <div>
			<ArticleLockedBadge article={item}/>
			<ArticleUsedBadge article={item}/>
		</div>
	},
	{
		name: '',
		label: 'Image',
		renderer: (item) => <ImagezImageThumb image={item.mainImage || item.topic?.mainImage}/>
	},
	{name: 'source.name', label: 'Source'},
	{name: 'processingState', label: 'State'},
	{name: 'title', label: 'Title'},
	{name: 'topic.realm.name', label: 'Realm'},
	{name: 'publishDate', label: 'Published', renderer: (item) => <DateTime value={item.publishDate}/>},
	{name: 'lastUpdatedOn', label: 'Updated', renderer: (item) => <DateTime value={item.lastUpdatedOn}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: 'lastUpdatedOn', desc: true}]}

function ArticlesList() {
	const {pagingString, published, internal} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Article>>();

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const onlyPublished = useMemo(
		() => published === 'true',
		[published]
	);

	const onlyInternal = useMemo(
		() => internal === 'true',
		[internal]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const createNew = () => {
		navigate("/articles/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest, pub?: boolean, int?: boolean) => {
			if (pub === undefined) pub = onlyPublished;
			if (int === undefined) int = onlyInternal;
			navigate(`/articles/${PagingUtil.pagingRequestToString(p)}/${pub}/${int}`);
		},
		[navigate, onlyPublished, onlyInternal]
	);

	const navigateToDetail = (l: Article) => {
		navigate(`/articles/detail/${l.id}`);
	}

	const applySearch = useCallback(
		(e?: FormEvent) => {
			e && e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging, onlyPublished, onlyInternal);
		},
		[paging, searchInput, navigateToPage, onlyPublished, onlyInternal]
	);

	const applyPublished = useCallback(
		(pub: boolean) => {
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging, pub, onlyInternal);
		},
		[paging, searchInput, navigateToPage, onlyInternal]
	);

	const applyInternal = useCallback(
		(int: boolean) => {
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging, onlyPublished, int);
		},
		[paging, searchInput, navigateToPage, onlyPublished]
	);

	const loadPageHandler = useCallback(
		() => {
			setData(undefined);
			restClient
				.articles
				.search(paging, onlyPublished, onlyInternal)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		},
		[paging, restClient, userAlerts, onlyPublished, onlyInternal]
	);

	useEffect(loadPageHandler, [paging, onlyPublished, onlyInternal]);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={loadPageHandler}/>
					<Button onClick={createNew} className="text-nowrap" disabled={true}>+ Add</Button>
					<div style={{width: '250px'}}>
						<Form onSubmit={applySearch} id="articles-search-form">
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
					<Switch checked={onlyPublished} onChange={(v) => applyPublished(v)} label="Published" id="published-switch"/>
					<Switch checked={onlyInternal} onChange={(v) => applyInternal(v)} label="Internal" id="internal-switch"/>
				</Stack>
			</div>

			<div className="pt-2 px-3">
				{
					(data === undefined) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								showSelect={false}
								header={HEADER}
								paging={paging}
								items={data.content}
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

export default ArticlesList;
