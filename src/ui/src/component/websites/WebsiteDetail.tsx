import {Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {Website} from "../../types/Website";
import {LanguageSelect} from "../languages/LanguageSelect";
import WebsiteBannersList from "./WebsiteBannersList";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'banners';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 6;

export default function WebsiteDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [searchParams, setSearchParams] = useSearchParams();
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<Website>();
	const [changed, setChanged] = useState<boolean>(false);

	const onChanged = useCallback(
		() => {
			if (!data) return;
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	useEffect(
		() => {
			if (!activeTab) return;
			searchParams.set(TAB_PARAM_NAME, activeTab);
			setSearchParams(searchParams, {replace: true});
		},
		[activeTab]
	);

	useEffect(
		() => {
			setActiveTab(StringUtil.getNonEmpty(searchParams.get(TAB_PARAM_NAME), DEFAULT_TAB));
		},
		[id]
	);

	const reload = useCallback(
		() => {
			setData(undefined);
			if (!id) {
				restClient.languages
					.loadAll()
					.then(
						(languages) => {
							setData({
								name: '',
								url: '',
								language: languages[0]
							});
						}
					).catch((e) => userAlerts.err(e));
				return;
			}
			restClient.websites
				.loadSingle(Number(id))
				.then(
					(w) => {
						setData({...w});
						setChanged(false);
					}
				)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.id);
			restClient
				.websites
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/websites/detail/${f.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts, navigate]
	);

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="d-flex justify-content-between p-2 gap-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton disabled={!changed} onClick={saveData}>Save</SaveButton>
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={data.name}
								onChange={
									(e) => {
										data.name = e.target.value;
										onChanged();
									}
								}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Language:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<div>
								<LanguageSelect
									language={data.language}
									onChange={
										(e) => {
											if (e) {
												data.language = e;
												onChanged();
											}
										}
									}
								/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>URL:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={StringUtil.toString(data.url)}
								onChange={(e) => {
									data.url = e.target.value;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Description:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								as="textarea"
								rows={5}
								value={StringUtil.toString(data.description)}
								onChange={(e) => {
									data.description = StringUtil.emptyToNull(e.target.value);
									onChanged();
								}}
							/>
						</Col>
					</Row>
				</Stack>
			</Form>
			{
				data.id && <div>
					<Tabs
						activeKey={activeTab}
						onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
					>
						<Tab eventKey="banners" title="Banners"/>
						<Tab eventKey="realms" title="Realms"/>
					</Tabs>
					<div className="px-2 py-1">
						{
							activeTab === "banners" && <WebsiteBannersList websiteId={data.id}/>
						}
						{
							activeTab === "realms" && <div>TBD - for now, websites consume all realms</div>
						}
					</div>
				</div>
			}
		</div>
	)
}
