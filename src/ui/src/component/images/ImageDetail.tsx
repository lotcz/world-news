import {Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {Image} from "../../types/Image";
import {ConfirmDialogContext, DeleteButton, SaveButton, Switch} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {ImagezImagePreview} from "./ImagezImage";
import ExternalLink from "../general/ExternalLink";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'articles';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function ImageDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<Image>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

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

	const onChanged = useCallback(
		() => {
			if (!data) return;
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	const reload = useCallback(
		() => {
			if (!id) {
				setData({
					name: '',
					isAiGenerated: false
				});
				return;
			}
			setData(undefined);
			restClient.images.loadSingle(Number(id))
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
				.images
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/images/detail/${f.id}`, {replace: true});
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

	const deleteImage = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this image?',
				() => {
					setDeleting(true);
					restClient
						.images
						.delete(Number(data.id))
						.then(
							(f) => {
								navigate(-1);
							})
						.catch((e: Error) => userAlerts.err(e))
						.finally(() => setDeleting(false))
				}
			);
		},
		[restClient, data, userAlerts, navigate, confirmDialog]
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
					<SaveButton loading={saving} disabled={!changed} onClick={saveData}>Save</SaveButton>
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteImage}>Delete</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Original URL:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-1">
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.originalUrl)}
								onChange={(e) => {
									data.originalUrl = StringUtil.emptyToNull(e.target.value);
									onChanged();
								}}
							/>
							{
								StringUtil.notBlank(data.originalUrl) && <ExternalLink url={data.originalUrl}/>
							}
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<Form.Control
									type="text"
									value={data.name}
									onChange={(e) => {
										data.name = e.target.value;
										onChanged();
									}}
								/>
								<div className="pt-2">
									{
										StringUtil.notBlank(data.name) && <ImagezImagePreview name={data.name}/>
									}
								</div>
							</div>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>AI generated:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Switch
								id="isAiGenerated"
								checked={data.isAiGenerated}
								onChange={(e) => {
									data.isAiGenerated = e;
									onChanged();
								}}
								label="Image was created with AI"
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
								value={StringUtil.getNonEmpty(data.description)}
								onChange={(e) => {
									data.description = e.target.value;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Source:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.source)}
								onChange={(e) => {
									data.source = StringUtil.emptyToNull(e.target.value);
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Author:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.author)}
								onChange={(e) => {
									data.author = StringUtil.emptyToNull(e.target.value);
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>License:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.license)}
								onChange={(e) => {
									data.license = StringUtil.emptyToNull(e.target.value);
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
						<Tab title="Topics" eventKey="topics"/>
						<Tab title="Articles" eventKey="articles"/>
					</Tabs>
					<div className="px-3 py-1">
						{
							activeTab === 'topics' && <div>topics</div>
						}
						{
							activeTab === 'articles' && <div>articles</div>
						}
					</div>
				</div>
			}
		</div>
	)
}
