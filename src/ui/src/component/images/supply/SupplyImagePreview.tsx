import React, {useCallback, useContext, useState} from 'react';
import {Image} from "../../../types/Image";
import {WnRestClientContext} from "../../../client/WnRestClient";
import {StringUtil} from "zavadil-ts-common";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {SaveButton} from "zavadil-react-common";
import {Col, Form, Row, Stack} from "react-bootstrap";
import {ImagezImagePreview} from "../ImagezImage";
import {Img} from "../Img";

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export type SupplyImagePreviewProps = {
	data: Image;
	onChange: (image: Image) => any;
	onConfirmed: (image: Image) => any;
}

export function SupplyImagePreview({data, onChange, onConfirmed}: SupplyImagePreviewProps) {
	const restClient = useContext(WnRestClientContext);
	const alerts = useContext(WnUserAlertsContext);
	const [saving, setSaving] = useState<boolean>(false);

	const save = useCallback(
		() => {
			if (StringUtil.isBlank(data.name)) {
				if (StringUtil.isBlank(data.originalUrl)) {
					alerts.err("Neither name or url provided!")
					return;
				}
				setSaving(true);
				restClient
					.images
					.uploadExternalUrl(data.originalUrl)
					.then(
						(health) => {
							data.name = health.name;
							onConfirmed(data);
						}
					)
					.catch((e) => alerts.err(e))
					.finally(() => setSaving(false));
			} else {
				onConfirmed(data);
			}
		},
		[restClient, alerts, onConfirmed, data]
	);

	return (
		<div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Original URL:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.originalUrl)}
								onChange={(e) => {
									data.originalUrl = StringUtil.emptyToNull(e.target.value);
									onChange({...data});
								}}
							/>
							{
								StringUtil.notBlank(data.originalUrl) && <div className="pt-2">
									<Img url={data.originalUrl} maxHeight={400}/>
								</div>
							}
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={data.name}
								onChange={(e) => {
									data.name = e.target.value;
									onChange({...data});
								}}
							/>
							{
								StringUtil.notBlank(data.name) && <div className="pt-2">
									<ImagezImagePreview name={data.name}/>
								</div>
							}
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
									onChange({...data});
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
									onChange({...data});
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
									onChange({...data});
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
									onChange({...data});
								}}
							/>
						</Col>
					</Row>
				</Stack>
			</Form>
			<div className="text-center m-2">
				<SaveButton loading={saving} size="lg" onClick={save}>Save</SaveButton>
			</div>
		</div>
	);
}

