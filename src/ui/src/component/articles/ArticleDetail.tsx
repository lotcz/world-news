import {Button, Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {Link, useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleStub} from "../../types/Article";
import {ConfirmDialogContext, DateTimeInput, DeleteButton, IconButton, SaveButton, Switch} from "zavadil-react-common";
import ProcessingStateSelect from "../general/ProcessingStateSelect";
import {BsArrowRightSquare, BsBoxArrowUpRight, BsTrash} from "react-icons/bs";
import RefreshIconButton from "../general/RefreshIconButton";
import TopicInfo from "../topics/TopicInfo";
import {LanguageIdSelect} from "../languages/LanguageSelect";
import ArticleTagsList from "./ArticleTagsList";
import ArticleAiLogList from "./ArticleAiLogList";
import ArticleSimilarArticlesList from "./ArticleSimilarArticlesList";
import ArticleSimilarTopicsList from "./ArticleSimilarTopicsList";
import {ImagezImagePreview} from "../images/ImagezImage";
import BackIconLink from "../general/BackIconLink";
import {SupplyImageDialogContext} from "../../util/SupplyImageDialogContext";
import ArticleSourceSelect from "../articleSources/ArticleSourceSelect";
import ArticleTypeSelect from "./ArticleTypeSelect";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'ai-log';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 6;

export default function ArticleDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const supplyImageDialog = useContext(SupplyImageDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<ArticleStub>();
	const [changed, setChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

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
					isLocked: false,
					articleType: 'Normal',
					title: '',
					mainImageIsIllustrative: true
				});
				return;
			}
			setData(undefined);
			restClient.articles.loadSingleStub(Number(id))
				.then(setData)
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
				.articles
				.saveStub(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/articles/detail/${f.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false))
		},
		[restClient, data, userAlerts, navigate]
	);

	const deleteArticle = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this article?',
				() => restClient
					.articles
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

	const showImageSupplyDialog = useCallback(
		() => data && supplyImageDialog.show(
			{
				onClose: () => supplyImageDialog.hide(),
				onSelected: (id) => {
					data.mainImageId = id;
					supplyImageDialog.hide();
					onChanged();
				},
				description: data.summary,
				entityType: 'Topic',
				entityId: data.id
			}
		),
		[data, supplyImageDialog]
	);

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="p-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton
						disabled={!changed}
						onClick={saveData}
						loading={saving}
					>Save</SaveButton>
					<DeleteButton onClick={deleteArticle}>Delete</DeleteButton>
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
							<Form.Label>Language:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<div>
								<LanguageIdSelect
									id={data.languageId}
									onChange={(e) => {
										data.languageId = e;
										onChanged();
									}}
								/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Source:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-2">
							<ArticleSourceSelect
								articleSourceId={data.sourceId}
								onChange={(e) => {
									data.sourceId = e;
									onChanged();
								}}
							/>
							{
								data.sourceId && <Link to={`/article-sources/detail/${data.sourceId}`}><BsArrowRightSquare/></Link>
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
							<Form.Label>Topic:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-2">
							<TopicInfo topicId={data.topicId}/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Tags:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							{
								data.id && <ArticleTagsList articleId={data.id}/>
							}
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Original URL:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.originalUrl)}
								onChange={(e) => {
									data.originalUrl = e.target.value;
									onChanged();
								}}
							/>
							{
								StringUtil.notBlank(data.originalUrl) && <a
									className="py-1 px-2"
									href={data.originalUrl}
									target="_blank"
								><BsBoxArrowUpRight/></a>
							}
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
													onChanged();
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
														onChanged();
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
							<Form.Label>
								Type:</Form.Label>
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
							<Form.Label>Title:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={data.title}
								onChange={(e) => {
									data.title = e.target.value;
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
								value={StringUtil.getNonEmpty(data.summary)}
								onChange={(e) => {
									data.summary = e.target.value;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Body:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								as="textarea"
								rows={20}
								value={StringUtil.getNonEmpty(data.body)}
								onChange={(e) => {
									data.body = e.target.value;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>GUID:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.uid)}
								onChange={(e) => {
									data.uid = e.target.value;
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
						<Tab eventKey="ai-log" title="AI Log"/>
						<Tab eventKey="similar-articles" title="Similar Articles"/>
						<Tab eventKey="similar-topics" title="Similar Topics"/>
					</Tabs>
					<div className="px-2 py-1">
						{
							activeTab === "ai-log" && <ArticleAiLogList articleId={data.id}/>
						}
						{
							activeTab === "similar-articles" && <ArticleSimilarArticlesList articleId={data.id}/>
						}
						{
							activeTab === "similar-topics" && <ArticleSimilarTopicsList articleId={data.id}/>
						}
					</div>
				</div>
			}
		</div>
	)
}
