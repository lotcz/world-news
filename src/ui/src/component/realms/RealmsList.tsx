import React, {FormEvent, useCallback, useContext, useEffect, useState} from 'react';
import {Button, Form, Stack, Tab, Tabs} from 'react-bootstrap';
import {TextInputWithReset} from "zavadil-react-common";
import {PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {Realm} from "../../types/Realm";
import RealmsTree from "./RealmsTree";
import RealmsTable from "./RealmsTable";
import RefreshIconButton from "../general/RefreshIconButton";
import {WnRestClientContext} from "../../client/WnRestClient";

function RealmsList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const [activeTab, setActiveTab] = useState<string>("tree");
	const [paging, setPaging] = useState<PagingRequest>(PagingUtil.pagingRequestFromString(pagingString));
	const [searchInput, setSearchInput] = useState<string>('');

	const createNew = () => {
		navigate("/realms/detail/add")
	};

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/realms/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToDetail = (l: Realm) => {
		navigate(`/realms/detail/${l.id}`);
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

	const reload = useCallback(
		() => {
			restClient.realms.reset();
			setPaging({...paging});
		},
		[paging, restClient]
	);

	useEffect(
		() => {
			setPaging(PagingUtil.pagingRequestFromString(pagingString));
		},
		[pagingString]
	);

	useEffect(
		() => {
			setSearchInput(StringUtil.getNonEmpty(paging?.search))
		},
		[paging]
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
				</Stack>
			</div>

			<div className="pt-2 px-3">
				<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(String(key))}>
					<Tab title="Tree" eventKey="tree"/>
					<Tab title="Table" eventKey="table"/>
				</Tabs>
				{
					activeTab === 'tree'
						? <RealmsTree paging={paging} onItemSelected={navigateToDetail} onPageRequested={navigateToPage}/>
						: <RealmsTable paging={paging} onItemSelected={navigateToDetail} onPageRequested={navigateToPage}/>
				}
			</div>
		</div>
	);
}

export default RealmsList;
