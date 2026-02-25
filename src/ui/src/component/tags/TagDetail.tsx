import {Button, Col, Form, Row, Spinner, Stack} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {FaFloppyDisk} from "react-icons/fa6";
import {NumberUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {TagStub} from "../../types/Tag";
import TagArticlesList from "./TagArticlesList";
import TagSelect from "./TagSelect";
import {BsBoxArrowUpRight} from "react-icons/bs";
import TagSynonymsList from "./TagSynonymsList";
import {LanguageIdSelect} from "../languages/LanguageSelect";
import {ConfirmDialogContext} from "zavadil-react-common";

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 6;

export default function TagDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<TagStub>();
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
			restClient.tags.loadSingleStub(Number(id))
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
				.tags
				.saveStub(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/tags/detail/${f.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts, navigate]
	);

	const deleteTag = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this tag?',
				() => restClient
					.tags
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
					<Button variant="danger" onClick={deleteTag}>Delete</Button>
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
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Synonym Of:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-2">
							<TagSelect
								tagId={data.synonymOfId}
								onChange={(tagId) => {
									data.synonymOfId = tagId;
									setData({...data});
									setChanged(true);
								}}/>
							{
								data.synonymOfId && <Link to={`/tags/detail/${data.synonymOfId}`}><BsBoxArrowUpRight/></Link>
							}
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Synonyms:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							{
								data.id && <TagSynonymsList tagId={data.id}/>
							}
						</Col>
					</Row>
				</Stack>
			</Form>
			<div className="p-3">
				{
					data.id && <TagArticlesList tagId={data.id}/>
				}
			</div>
		</div>
	)
}
