import {Button, Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {FaFloppyDisk} from "react-icons/fa6";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {TopicStub} from "../../types/Topic";
import TopicArticlesList from "./TopicArticlesList";
import ProcessingStateSelect from "../general/ProcessingStateSelect";
import RefreshIconButton from "../general/RefreshIconButton";
import {LanguageIdSelect} from "../languages/LanguageSelect";
import TopicAiLogList from "./TopicAiLogList";
import TopicSimilarTopicsList from "./TopicSimilarTopicsList";
import TopicSimilarArticlesList from "./TopicSimilarArticlesList";

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 6;

export default function TopicDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<TopicStub>();
	const [changed, setChanged] = useState<boolean>(false);

	const reload = useCallback(
		() => {
			if (!id) {
				setData({
					name: '',
					articleCount: 0
				});
				return;
			}
			setData(undefined);
			restClient.topics.loadSingleStub(Number(id))
				.then(setData)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, restClient, userAlerts]
	);

	useEffect(reload, []);

	const saveData = useCallback(
		() => {
			if (!data) return;
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
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
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
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={data.name}
								onChange={(e) => {
									data.name = e.target.value;
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
				</Stack>
			</Form>
			<Tabs defaultActiveKey="articles">
				<Tab title="Articles" eventKey="articles">
					<div className="px-3">
						{
							data.id && <TopicArticlesList topicId={data.id}/>
						}
					</div>
				</Tab>
				<Tab title="AI Log" eventKey="logs">
					<div className="px-3">
						{
							data.id && <TopicAiLogList topicId={data.id}/>
						}
					</div>
				</Tab>
				<Tab title="Similar Topics" eventKey="similarTopics">
					<div className="px-3">
						{
							data.id && <TopicSimilarTopicsList topicId={data.id}/>
						}
					</div>
				</Tab>
				<Tab title="Similar Articles" eventKey="similarArticles">
					<div className="px-3">
						{
							data.id && <TopicSimilarArticlesList topicId={data.id}/>
						}
					</div>
				</Tab>
			</Tabs>

		</div>
	)
}
