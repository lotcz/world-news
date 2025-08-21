import {Button, Col, Form, Row, Spinner, Stack} from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {FaFloppyDisk} from "react-icons/fa6";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {ArticleSource} from "../../types/ArticleSource";
import {DateTimeInput} from "zavadil-react-common";
import ImportTypeSelect from "./ImportTypeSelect";
import {LanguageSelect} from "../languages/LanguageSelect";

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 3;

export default function ArticleSourceDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<ArticleSource>();
	const [changed, setChanged] = useState<boolean>(false);

	useEffect(
		() => {
			if (!id) {
				setData({
					name: '',
					url: '',
					importType: 'Rss',
					realms: []
				});
				return;
			}
			restClient.articleSources.loadSingle(Number(id))
				.then(setData)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id]
	);

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
							navigate(`/article-sources/detail/${f.id}`);
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
				.startIngestion(id)
				.then((f) => userAlerts.info("Ingestion started"))
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts]
	);

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="d-flex justify-content-between p-2 gap-2">
				<Stack direction="horizontal" gap={2}>
					<Button variant="link" onClick={() => navigate('/article-sources')}>Back</Button>
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
					<Button variant="primary" onClick={() => startIngestion()}>Ingest</Button>
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
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={data.url}
								onChange={(e) => {
									data.url = e.target.value;
									setData({...data});
									setChanged(true);
								}}
							/>
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
			</Form>
		</div>
	)
}
