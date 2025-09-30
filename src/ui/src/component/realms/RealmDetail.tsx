import {Button, Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {Link, useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, ObjectUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Realm} from "../../types/Realm";
import RealmChildrenList from "./RealmChildrenList";
import RealmSelect from "./RealmSelect";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DateTimeInput, SaveButton, Switch} from "zavadil-react-common";
import {BsArrowUpSquare} from "react-icons/bs";
import RealmSimilarTopicsList from "./RealmSimilarTopicsList";
import RealmTopicsList from "./RealmTopicsList";
import BackIconLink from "../general/BackIconLink";
import CountBadge from "../general/CountBadge";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'sub-realms';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 5;

export default function RealmDetail() {
	const {id, parentId} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<Realm>();
	const [saving, setSaving] = useState<boolean>(false);
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
			if (!id) {
				setData({
					isHidden: false,
					name: '',
					summary: '',
					topicCount: 0,
					parentId: NumberUtil.parseNumber(parentId)
				});
				return;
			}
			setData(undefined);
			restClient.realms
				.loadSingle(Number(id))
				.then((r) => setData(ObjectUtil.clone(r)))
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.id);
			setSaving(true);
			restClient
				.realms
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/realms/detail/${f.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false));
		},
		[restClient, data, userAlerts, navigate]
	);

	const deleteRealm = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				`Really delete this realm? All ${data.topicCount} topics will be categorized again.`,
				() => restClient
					.realms
					.delete(Number(data.id))
					.then(
						(f) => {
							navigate(-1);
						})
					.catch((e: Error) => userAlerts.err(e))
			);
		},
		[restClient, data, userAlerts, navigate, confirmDialog]
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
					<SaveButton
						disabled={!changed}
						onClick={saveData}
						loading={saving}
					>
						Save
					</SaveButton>
					<Button variant="danger" onClick={deleteRealm}>Delete</Button>
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Hidden:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<Switch
								checked={data.isHidden}
								onChange={(e) => {
									data.isHidden = e;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Parent:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-2">
							<RealmSelect
								realmId={data.parentId}
								onChange={
									(e) => {
										data.parentId = e;
										onChanged();
									}
								}
							/>
							{
								data.parentId && <Link to={`/realms/detail/${data.parentId}`}><BsArrowUpSquare/></Link>
							}
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Published:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-2">
							<div className="d-flex align-items-center gap-2">
								<DateTimeInput
									value={data.publishDate}
									onChange={(e) => {
										data.publishDate = e;
										onChanged();
									}}
								/>
								{
									data.publishDate ? <Button
											variant="warning"
											onClick={
												() => {
													data.publishDate = null;
													onChanged();
												}
											}>Unpublish</Button>
										: <Button
											variant="success"
											onClick={
												() => {
													data.publishDate = new Date();
													onChanged();
												}
											}>Publish</Button>
								}
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={data.name}
								onChange={(e) => {
									data.name = e.target.value;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Summary:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								as="textarea"
								rows={5}
								value={data.summary}
								onChange={(e) => {
									data.summary = e.target.value;
									onChanged();
								}}
							/>
						</Col>
					</Row>
				</Stack>
			</Form>
			{
				data.id &&
				<div>
					<Tabs
						activeKey={activeTab}
						onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
					>
						<Tab title="Sub-realms" eventKey="sub-realms"/>
						<Tab
							title={
								<div className="d-flex align-items-center gap-2">
									<div>Topics</div>
									<CountBadge count={data.topicCount}/>
								</div>
							}
							eventKey="topics"
						/>
						<Tab title="Similar Topics" eventKey="similar-topics"/>
					</Tabs>
					<div className="p-3">
						{
							activeTab === 'sub-realms' && <div>
								<div>
									<Button onClick={() => navigate(`/realms/detail/add/${data.id}`)}>+ Add</Button>
								</div>
								<RealmChildrenList realmId={data.id}/>
							</div>
						}
						{
							activeTab === 'topics' && <div>
								<div>
									<Button onClick={() => navigate(`/realms/detail/add/${data.id}`)}>+ Add</Button>
								</div>
								<RealmTopicsList realmId={data.id}/>
							</div>
						}
						{
							activeTab === 'similar-topics' && <div>
								<div>
									<Button onClick={() => navigate(`/realms/detail/add/${data.id}`)}>+ Add</Button>
								</div>
								<RealmSimilarTopicsList realmId={data.id}/>
							</div>
						}
					</div>
				</div>
			}
		</div>
	)
}
