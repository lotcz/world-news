import {Button, Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {FaFloppyDisk} from "react-icons/fa6";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleStub} from "../../types/Article";
import {ConfirmDialogContext, DateTimeInput, Switch} from "zavadil-react-common";
import ProcessingStateSelect from "../general/ProcessingStateSelect";
import {BsBoxArrowUpRight} from "react-icons/bs";
import RefreshIconButton from "../general/RefreshIconButton";
import ArticleSourceInfo from "../articleSources/ArticleSourceInfo";
import TopicInfo from "../topics/TopicInfo";
import {LanguageIdSelect} from "../languages/LanguageSelect";
import ArticleTagsList from "./ArticleTagsList";
import ArticleAiLogList from "./ArticleAiLogList";
import ArticleSimilarArticlesList from "./ArticleSimilarArticlesList";
import ArticleSimilarTopicsList from "./ArticleSimilarTopicsList";
import ImagezImagePreview from "../general/ImagezImagePreview";

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
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<ArticleStub>();
	const [changed, setChanged] = useState<boolean>(false);

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
					title: ''
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

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="d-flex justify-content-between p-2 gap-2">
				<Stack direction="horizontal" gap={2}>
					<Button variant="link" onClick={() => navigate(-1)}>Back</Button>
					<RefreshIconButton onClick={reload}/>
					<Button
						disabled={!changed}
						onClick={saveData}
						className="d-flex gap-2 align-items-center text-nowrap"
					>
						<div className="d-flex align-items-center gap-2">
							<FaFloppyDisk/>
							<div>Save</div>
						</div>
					</Button>
					<Button variant="danger" onClick={deleteArticle}>Delete</Button>
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Locked:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
							<Switch
								checked={data.isLocked}
								onChange={(e) => {
									data.isLocked = e;
									setData({...data});
									setChanged(true);
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
										setData({...data});
										setChanged(true);
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
										setData({...data});
										setChanged(true);
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
							<div>
								<DateTimeInput
									value={data.publishDate}
									onChange={(e) => {
										data.publishDate = e;
										setData({...data});
										setChanged(true);
									}}
								/>
							</div>
							<ArticleSourceInfo articleSourceId={data.sourceId}/>
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
									setData({...data});
									setChanged(true);
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
							<ImagezImagePreview name="e6a8d25da0b679ce3eedc18ac7302036.jpg"/>
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
									setData({...data});
									setChanged(true);
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
									setData({...data});
									setChanged(true);
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
								rows={15}
								value={StringUtil.getNonEmpty(data.body)}
								onChange={(e) => {
									data.body = e.target.value;
									setData({...data});
									setChanged(true);
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
								value={StringUtil.getNonEmpty(data.originalUid)}
								onChange={(e) => {
									data.originalUid = e.target.value;
									setData({...data});
									setChanged(true);
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
