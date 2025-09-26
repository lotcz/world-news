import {Button, Col, Form, Row, Spinner, Stack} from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {FaFloppyDisk} from "react-icons/fa6";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleSource} from "../../types/ArticleSource";
import {ConfirmDialogContext, DateTimeInput} from "zavadil-react-common";
import ImportTypeSelect from "./ImportTypeSelect";
import {LanguageSelect} from "../languages/LanguageSelect";
import {BsBoxArrowUpRight} from "react-icons/bs";
import ArticleSourceArticlesList from "./ArticleSourceArticlesList";
import RefreshIconButton from "../general/RefreshIconButton";
import ProcessingStateSelect from "../general/ProcessingStateSelect";

const COL_1_MD = 4;
const COL_2_MD = 8;
const COL_1_LG = 2;
const COL_2_LG = 9;

export default function ArticleSourceDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<ArticleSource>();
	const [changed, setChanged] = useState<boolean>(false);

	const reload = useCallback(
		() => {
			if (!id) {
				setData({
					name: '',
					url: '',
					importType: 'Rss',
					articleCount: 0,
					realms: []
				});
				return;
			}
			setData(undefined);
			restClient.articleSources
				.loadSingle(Number(id))
				.then(
					(ars) => {
						setData({...ars});
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
				.articleSources
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/article-sources/detail/${f.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts, navigate]
	);

	const startIngestion = useCallback(
		() => {
			const id = data?.id;
			if (!id) return;
			restClient
				.startIngestionBySource(id)
				.then((f) => userAlerts.info("Ingestion started"))
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts]
	);

	const deleteArticleSource = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				`All ${data.articleCount} articles will be deleted! Really delete this article source?`,
				() => restClient
					.articleSources
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
					<Button variant="primary" onClick={startIngestion}>Ingest</Button>
					<Button variant="danger" onClick={deleteArticleSource}>Delete</Button>
				</Stack>
			</div>
			<Form className="p-3">
				<Row>
					<Col>
						<Stack direction="vertical" gap={2}>
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
							<Row className="align-items-center">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>Type:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG}>
									<ImportTypeSelect
										value={data.importType}
										onChange={
											(e) => {
												data.importType = StringUtil.getNonEmpty(e);
												setData({...data});
												setChanged(true);
											}
										}
									/>
								</Col>
							</Row>
							<Row className="align-items-center">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>URL:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex">
									<Form.Control
										type="text"
										value={data.url}
										onChange={(e) => {
											data.url = e.target.value;
											setData({...data});
											setChanged(true);
										}}
									/>
									{
										StringUtil.notBlank(data.url) && <a
											className="py-1 px-2"
											href={data.url}
											target="_blank"
										><BsBoxArrowUpRight/></a>
									}
								</Col>
							</Row>
							<Row className="align-items-center">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>Language:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG}>
									<LanguageSelect
										language={data.language}
										onChange={
											(e) => {
												data.language = e;
												setData({...data});
												setChanged(true);
											}
										}
									/>
								</Col>
							</Row>
							<Row className="align-items-center">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>State:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG}>
									<ProcessingStateSelect
										value={data.processingState}
										onChange={
											(e) => {
												data.processingState = StringUtil.getNonEmpty(e);
												setData({...data});
												setChanged(true);
											}
										}
									/>
								</Col>
							</Row>
							<Row className="align-items-center">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>Last Imported:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG}>
									<DateTimeInput
										value={data.lastImported}
										onChange={
											(e) => {
												data.lastImported = e;
												setData({...data});
												setChanged(true);
											}
										}
									/>
								</Col>
							</Row>
						</Stack>
					</Col>
					<Col>
						<Stack direction="vertical" gap={2}>
							<Row className="align-items-center">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>Limit to element:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG}>
									<Form.Control
										type="text"
										value={StringUtil.getNonEmpty(data.limitToElement)}
										onChange={(e) => {
											data.limitToElement = StringUtil.emptyToNull(e.target.value);
											setData({...data});
											setChanged(true);
										}}
									/>
								</Col>
							</Row>
							<Row className="align-items-start">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>Exclude elements:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG}>
									<Form.Control
										as="textarea"
										rows={4}
										value={StringUtil.getNonEmpty(data.excludeElements)}
										onChange={(e) => {
											data.excludeElements = StringUtil.emptyToNull(e.target.value);
											setData({...data});
											setChanged(true);
										}}
									/>
								</Col>
							</Row>
							<Row className="align-items-start">
								<Col md={COL_1_MD} lg={COL_1_LG}>
									<Form.Label>Exclude phrases:</Form.Label>
								</Col>
								<Col md={COL_2_MD} lg={COL_2_LG}>
									<Form.Control
										as="textarea"
										rows={4}
										value={StringUtil.getNonEmpty(data.filterOutText)}
										onChange={(e) => {
											data.filterOutText = StringUtil.emptyToNull(e.target.value);
											setData({...data});
											setChanged(true);
										}}
									/>
								</Col>
							</Row>
						</Stack>
					</Col>
				</Row>

			</Form>
			{
				data.id && <ArticleSourceArticlesList articleSourceId={data.id}/>
			}
		</div>
	)
}
