import {Button, Col, Form, Row, Spinner, Stack} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DateTimeInput, DeleteButton, SaveButton, Switch} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {BannerStub} from "../../types/Banner";
import {WebsiteIdSelect} from "../websites/WebsiteSelect";
import BannerTypeSelect from "./BannerTypeSelect";
import {BsArrowRightSquare} from "react-icons/bs";
import BannerGenerator from "./BannerGenerator";


const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 6;

export default function BannerDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<BannerStub>();
	const [changed, setChanged] = useState<boolean>(false);
	const [generatorOpen, setGeneratorOpen] = useState<boolean>(false);

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
			setData(undefined);
			if (!id) {
				setData({
					name: '',
					type: 'Content',
					requiresCookiesConsent: false
				});
				return;
			}
			restClient
				.banners
				.loadSingleStub(Number(id))
				.then(
					(b) => {
						setData({...b});
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
				.banners
				.saveStub(data)
				.then(
					(b) => {
						if (inserting) {
							navigate(`/banners/detail/${b.id}`, {replace: true});
						} else {
							setData({...b});
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts, navigate]
	);

	const deleteBanner = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this banner?',
				() => restClient
					.banners
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
					<SaveButton disabled={!changed} onClick={saveData}>Save</SaveButton>
					{
						data.id && <DeleteButton onClick={deleteBanner}>Delete</DeleteButton>
					}
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Website:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-2">
							<div>
								<WebsiteIdSelect
									id={data.websiteId}
									onChange={
										(e) => {
											data.websiteId = e;
											onChanged();
										}
									}
								/>
							</div>
							{
								data.websiteId &&
								<Link to={`/websites/detail/${data.websiteId}`} className="d-flex"><BsArrowRightSquare/></Link>
							}
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
							<Form.Label>Type:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center">
							<div>
								<BannerTypeSelect
									value={data.type}
									onChange={
										(value) => {
											data.type = StringUtil.toString(value);
											onChanged();
										}
									}
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
							<Form.Label htmlFor="requiresCookiesConsent">Cookies:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Switch
								id="requiresCookiesConsent"
								checked={data.requiresCookiesConsent}
								onChange={(e) => {
									data.requiresCookiesConsent = e;
									onChanged();
								}}
								label="Requires cookies consent"
							/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Description HTML:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								as="textarea"
								rows={3}
								value={StringUtil.getNonEmpty(data.description)}
								onChange={(e) => {
									data.description = e.target.value;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Content HTML:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex flex-column gap-2">
							<Form.Control
								as="textarea"
								rows={5}
								value={StringUtil.toString(data.contentHtml)}
								onChange={(e) => {
									data.contentHtml = StringUtil.emptyToNull(e.target.value);
									onChanged();
								}}
							/>
							<div>
								<Button onClick={() => setGeneratorOpen(true)}>Create...</Button>
							</div>
						</Col>
					</Row>
				</Stack>
			</Form>
			{
				data && generatorOpen && <BannerGenerator
					type={data.type}
					onCreated={
						(html) => {
							data.contentHtml = html;
							onChanged();
							setGeneratorOpen(false)
						}
					}
					onCanceled={() => setGeneratorOpen(false)}
				/>
			}
		</div>
	)
}
