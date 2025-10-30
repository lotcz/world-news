import {Button, Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {Link, useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, ObjectUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {TopicStub} from "../../types/Topic";
import TopicInternalArticlesList from "./TopicInternalArticlesList";
import ProcessingStateSelect from "../general/ProcessingStateSelect";
import RefreshIconButton from "../general/RefreshIconButton";
import TopicAiLogList from "./TopicAiLogList";
import TopicSimilarTopicsList from "./TopicSimilarTopicsList";
import TopicSimilarArticlesList from "./TopicSimilarArticlesList";
import TopicSimilarRealmsList from "./TopicSimilarRealmsList";
import RealmSelect from "../realms/RealmSelect";
import {BsArrowRightSquare, BsCheck, BsLock, BsTrash, BsXCircle} from "react-icons/bs";
import {DateTimeInput, IconButton, LoadingButton, SaveButton, Switch} from "zavadil-react-common";
import {ImagezImagePreview} from "../images/ImagezImage";
import BackIconLink from "../general/BackIconLink";
import {SupplyImageDialogContext} from "../../util/SupplyImageDialogContext";
import TopicExternalArticlesList from "./TopicExternalArticlesList";
import InternalArticlesCount from "./badges/InternalArticlesCount";
import ArticleTypeSelect from "../articles/ArticleTypeSelect";
import ExternalSourcesCount from "./badges/ExternalSourcesCount";
import UnusedArticlesCount from "./badges/UnusedArticlesCount";
import ExternalArticlesCount from "./badges/ExternalArticlesCount";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'internal-articles';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 6;

export default function TopicDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const supplyImageDialog = useContext(SupplyImageDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<TopicStub>();
	const [changed, setChanged] = useState<boolean>(false);
	const [imageChanged, setImageChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const onChanged = useCallback(
		() => {
			if (!data) return;
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	const onImageChanged = useCallback(
		() => {
			if (!data) return;
			setData({...data});
			setImageChanged(true);
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
					isLocked: false,
					articleType: 'Normal',
					name: '',
					articleCount: 0,
					articleCountInternal: 0,
					articleCountExternal: 0,
					mainImageIsIllustrative: true,
					externalArticlesSourceCount: 0,
					externalArticlesUnusedCount: 0
				});
				setChanged(true);
				return;
			}
			setData(undefined);
			restClient.topics
				.loadSingleStub(Number(id))
				.then(
					(t) => {
						setData(t);
						setChanged(false);
						setImageChanged(false);
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
			setSaving(true);
			if (data.id && imageChanged && !changed) {
				restClient
					.topics
					.changeImage(data.id, data.mainImageId || null, data.mainImageIsIllustrative)
					.then(() => setImageChanged(false))
					.catch((e: Error) => userAlerts.err(e))
					.finally(() => setSaving(false));
			} else {
				const inserting = NumberUtil.isEmpty(data.id);
				restClient
					.topics
					.saveStub(data)
					.then(
						(f) => {
							if (inserting) {
								navigate(`/topics/detail/${f.id}`, {replace: true});
							} else {
								setData(f);
							}
							setChanged(false);
							setImageChanged(false);
						})
					.catch((e: Error) => userAlerts.err(e))
					.finally(() => setSaving(false));
			}
		},
		[restClient, data, userAlerts, navigate, changed, imageChanged]
	);

	const showImageSupplyDialog = useCallback(
		() => data && supplyImageDialog.show(
			{
				onClose: () => supplyImageDialog.hide(),
				onSelected: (id) => {
					data.mainImageId = id;
					setData({...data});
					supplyImageDialog.hide();
					setImageChanged(true);
				},
				description: data.summary,
				entityType: 'Topic',
				entityId: data.id
			}
		),
		[data, supplyImageDialog]
	);

	const unpublishAndLock = useCallback(
		() => {
			setSaving(true);
			restClient
				.topics
				.unpublishAndLock(Number(id))
				.then(reload)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false));
		},
		[id, restClient, userAlerts, reload]
	);

	const approveForCompilation = useCallback(
		() => {
			setSaving(true);
			restClient
				.topics
				.approveForCompilation(Number(id))
				.then(reload)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false));
		},
		[id, restClient, userAlerts, reload]
	);

	const rejectForCompilation = useCallback(
		() => {
			setSaving(true);
			restClient
				.topics
				.rejectForCompilation(Number(id))
				.then(reload)
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false));
		},
		[id, restClient, userAlerts, reload]
	);

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="d-flex justify-content-between p-2 gap-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed || imageChanged}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton
						disabled={!(changed || imageChanged)}
						loading={saving}
						onClick={saveData}
					>Save</SaveButton>
					{
						ObjectUtil.notEmpty(data.publishDate) && <LoadingButton
							disabled={changed || imageChanged}
							variant="warning"
							loading={saving}
							icon={<BsLock/>}
							onClick={unpublishAndLock}
						>Unpublish & Lock</LoadingButton>
					}
					{
						data.processingState === 'NotReady'
						&& data.externalArticlesSourceCount > 1
						&& data.externalArticlesUnusedCount > 1
						&& <>
							<LoadingButton
								disabled={changed || imageChanged}
								variant="success"
								loading={saving}
								icon={<BsCheck/>}
								onClick={approveForCompilation}
							>Approve</LoadingButton>
							<LoadingButton
								disabled={changed || imageChanged}
								variant="secondary"
								loading={saving}
								icon={<BsXCircle/>}
								onClick={rejectForCompilation}
							>Reject</LoadingButton>
						</>
					}
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label htmlFor="isLocked">Locked:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<Switch
								id="isLocked"
								checked={data.isLocked}
								onChange={(e) => {
									data.isLocked = e;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Realm:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-2">
							<RealmSelect
								realmId={data.realmId}
								onChange={
									(e) => {
										data.realmId = e;
										onChanged();
									}
								}
							/>
							{
								data.realmId && <Link to={`/realms/detail/${data.realmId}`}><BsArrowRightSquare/></Link>
							}
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>State:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<div>
								<ProcessingStateSelect
									value={data.processingState}
									onChange={(e) => {
										data.processingState = e;
										onChanged();
									}}
								/>
							</div>
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
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Image:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							{
								data.mainImageId ? <div>
										<div className="d-flex align-items-center gap-3">
											<Switch
												id="mainImageIsIllustrative"
												checked={data.mainImageIsIllustrative}
												onChange={(e) => {
													data.mainImageIsIllustrative = e;
													onImageChanged();
												}}
												label="Illustrative photo"

											/>
										</div>
										<div className="mt-1">
											<ImagezImagePreview id={data.mainImageId}/>
										</div>
										<div className="mt-2 d-flex align-items-center gap-3">
											<IconButton
												size="sm"
												variant="danger"
												icon={<BsTrash/>}
												onClick={
													() => {
														data.mainImageId = null;
														onImageChanged();
													}
												}
											>Remove</IconButton>
											<Button size="sm" onClick={() => navigate(`/images/detail/${data.mainImageId}`)}>Edit..</Button>
											<Button size="sm" onClick={showImageSupplyDialog}>Change...</Button>
										</div>
									</div>
									: <Button size="sm" onClick={showImageSupplyDialog}>Supply...</Button>
							}
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Type:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<div>
								<ArticleTypeSelect
									value={data.articleType}
									onChange={(e) => {
										data.articleType = StringUtil.toString(e);
										onChanged();
									}}
								/>
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
								rows={7}
								value={StringUtil.getNonEmpty(data.summary)}
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
				data.id && <div>
					<Tabs
						activeKey={activeTab}
						onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
					>
						<Tab
							title={
								<div className="d-flex align-items-center gap-2">
									<div>Internal Articles</div>
									<InternalArticlesCount topic={data}/>
								</div>
							}
							eventKey="internal-articles"
						/>
						<Tab
							title={
								<div className="d-flex align-items-center gap-2">
									<div>External Articles</div>
									<ExternalArticlesCount topic={data}/>
									<ExternalSourcesCount topic={data}/>
									<UnusedArticlesCount topic={data}/>
								</div>
							}
							eventKey="external-articles"
						/>
						<Tab title="AI Log" eventKey="ai-log"/>
						<Tab title="Similar Topics" eventKey="similar-topics"/>
						<Tab title="Similar Articles" eventKey="similar-articles"/>
						<Tab title="Similar Realms" eventKey="similar-realms"/>
					</Tabs>
					<div className="px-3 py-1">
						{
							activeTab === 'internal-articles' && <TopicInternalArticlesList topicId={data.id}/>
						}
						{
							activeTab === 'external-articles' && <TopicExternalArticlesList topicId={data.id}/>
						}
						{
							activeTab === 'ai-log' && <TopicAiLogList topicId={data.id}/>
						}
						{
							activeTab === 'similar-topics' && <TopicSimilarTopicsList topicId={data.id} onUpdate={reload}/>
						}
						{
							activeTab === 'similar-articles' && <TopicSimilarArticlesList topicId={data.id} onUpdate={reload}/>
						}
						{
							activeTab === 'similar-realms' && <TopicSimilarRealmsList topicId={data.id}/>
						}
					</div>
				</div>
			}
		</div>
	)
}

