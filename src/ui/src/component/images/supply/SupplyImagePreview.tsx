import React, {useCallback, useContext, useState} from 'react';
import {Image} from "../../../types/Image";
import {WnRestClientContext} from "../../../client/WnRestClient";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {LoadingButton, SaveButton, Switch} from "zavadil-react-common";
import {Col, Form, Row, Stack} from "react-bootstrap";
import {ImagezImage, ImagezImagePreview} from "../ImagezImage";
import {Img} from "../Img";
import ExternalLink from "../../general/ExternalLink";
import VerticalAlignSelect from "../VerticalAlignSelect";
import HorizontalAlignSelect from "../HorizontalAlignSelect";
import {BiCloudDownload} from "react-icons/bi";

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

	const onChanged = useCallback(
		() => {
			if (!data) return;
			onChange({...data});
		},
		[data, onChange]
	);

	const downloadUpload = useCallback(
		() => {
			if (StringUtil.isBlank(data.originalUrl)) {
				return Promise.reject("Neither name or url provided!");
			}
			setSaving(true);
			return restClient
				.images
				.uploadExternalUrl(data.originalUrl)
				.then(
					(health) => {
						data.name = health.name;
						data.originalWidth = health.width;
						data.originalHeight = health.height;
						return data;
					}
				)
				.finally(() => setSaving(false));
		},
		[restClient, data]
	);

	const save = useCallback(
		() => {
			if (StringUtil.isBlank(data.name)) {
				setSaving(true);
				downloadUpload()
					.then((d) => onConfirmed(d))
					.catch((e) => alerts.err(e))
					.finally(() => setSaving(false));
			} else {
				onConfirmed(data);
			}
		},
		[alerts, onConfirmed, downloadUpload, data]
	);

	return (
		<div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Original URL:</Form.Label>
						</Col>
						<Col md={12 - COL_1_MD} lg={12 - COL_1_LG}>
							<div className="d-flex align-items-center gap-1">
								<Form.Control
									type="text"
									value={StringUtil.getNonEmpty(data.originalUrl)}
									onChange={(e) => {
										data.originalUrl = StringUtil.emptyToNull(e.target.value);
										onChanged();
									}}
								/>
								<LoadingButton loading={saving} icon={<BiCloudDownload/>} variant="success"
											   onClick={downloadUpload}>Download</LoadingButton>
							</div>
							{
								StringUtil.notBlank(data.originalUrl) && <div className="pt-2">
									<Img url={data.originalUrl} maxHeight={400} maxWidth={600}/>
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
									onChanged();
								}}
							/>
							{
								StringUtil.notBlank(data.name) && <div className="pt-2 d-flex align-items-end gap-3">
									<ImagezImagePreview
										name={data.name}
										verticalAlign={data.verticalAlign}
										horizontalAlign={data.horizontalAlign}
									/>
									<ImagezImage
										type="crop"
										name={data.name}
										verticalAlign={data.verticalAlign}
										horizontalAlign={data.horizontalAlign}
										width={205}
										height={120}
									/>
									<ImagezImage
										type="crop"
										name={data.name}
										verticalAlign={data.verticalAlign}
										horizontalAlign={data.horizontalAlign}
										width={100}
										height={100}
									/>
								</div>
							}
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Align:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-3">
							Vertical:
							<VerticalAlignSelect
								value={data.verticalAlign}
								onChange={(e) => {
									data.verticalAlign = e;
									onChanged();
								}}
							/>
							Horizontal:
							<HorizontalAlignSelect
								value={data.horizontalAlign}
								onChange={(e) => {
									data.horizontalAlign = e;
									onChanged();
								}}
							/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Size:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-3">
							Width:
							<Form.Control
								type="text"
								value={StringUtil.toString(data.originalWidth)}
								onChange={(e) => {
									data.originalWidth = NumberUtil.parseNumber(e.target.value);
									onChanged();
								}}
							/>
							Height:
							<Form.Control
								type="text"
								value={StringUtil.toString(data.originalHeight)}
								onChange={(e) => {
									data.originalHeight = NumberUtil.parseNumber(e.target.value);
									onChanged();
								}}
							/>
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
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Source URL:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-1">
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.sourceUrl)}
								onChange={(e) => {
									data.sourceUrl = StringUtil.emptyToNull(e.target.value);
									onChanged();
								}}
							/>
							{
								StringUtil.notBlank(data.sourceUrl) && <ExternalLink url={data.sourceUrl}/>
							}
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
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Author URL:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG} className="d-flex align-items-center gap-1">
							<Form.Control
								type="text"
								value={StringUtil.getNonEmpty(data.authorUrl)}
								onChange={(e) => {
									data.authorUrl = StringUtil.emptyToNull(e.target.value);
									onChanged();
								}}
							/>
							{
								StringUtil.notBlank(data.authorUrl) && <ExternalLink url={data.authorUrl}/>
							}
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
			<div className="text-center m-2">
				<SaveButton loading={saving} size="lg" onClick={save}>Save</SaveButton>
			</div>
		</div>
	);
}

