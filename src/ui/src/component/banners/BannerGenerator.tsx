import {Localize, Switch} from "zavadil-react-common";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Button, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row, Stack} from "react-bootstrap";
import {SupplyImageDialogContext} from "../../util/SupplyImageDialogContext";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import ResizeTypeSelect from "../images/ResizeTypeSelect";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {ImagezImage} from "../images/ImagezImage";

export type BannerGeneratorProps = {
	type?: string | null;
	onCreated: (html?: string | null) => any;
	onCanceled: () => any;
}

const COL_1_MD = 4;
const COL_2_MD = 8;
const COL_1_LG = 3;
const COL_2_LG = 9;

export default function BannerGenerator({type, onCreated, onCanceled}: BannerGeneratorProps) {
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const supplyImageDialog = useContext(SupplyImageDialogContext);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [external, setExternal] = useState<boolean>(true);
	const [url, setUrl] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [ext, setExt] = useState<string>('webp');
	const [width, setWidth] = useState<string>('250');
	const [height, setHeight] = useState<string>('450');
	const [resizeType, setResizeType] = useState<string>('fit');

	useEffect(
		() => {
			switch (type) {
				case 'Content':
					setWidth('630');
					setHeight('130');
					break;
				case 'Vertical':
					setWidth('310');
					setHeight('650');
					break;
				case 'Horizontal':
					setWidth('900');
					setHeight('250');
					break;
				case 'Fullscreen':
					setWidth('1920');
					setHeight('1080');
					break;
			}
			supplyImageDialog.show(
				{
					entityType: 'Banner',
					onClose: () => {
						supplyImageDialog.hide();
						onCanceled();
					},
					onSelected: (id) => {
						restClient.images
							.loadSingle(id)
							.then(
								(image) => {
									setName(image.name);
									supplyImageDialog.hide();
									setModalVisible(true);
								}
							).catch((e) => userAlerts.err(e));
					}
				}
			)
		},
		[]
	);

	const generate = useCallback(
		() => restClient.images
			.getImagezResizedUrlByName(name, resizeType, Number(NumberUtil.parseNumber(width)), Number(NumberUtil.parseNumber(height)))
			.then(
				(imgurl) => {
					const img = `<img src="${imgurl}" alt="banner"/>`;
					if (StringUtil.isEmpty(url)) {
						onCreated(img);
					} else {
						onCreated(`<a href="${url}" target="${external ? '_blank' : '_top'}">${img}</a>`);
					}
				}
			).catch((e) => userAlerts.err(e))
		,
		[restClient, url, external, name, resizeType, width, height, userAlerts, onCreated]
	);

	return <Modal show={modalVisible} onHide={onCanceled}>
		<ModalHeader><Localize text={"Create banner"}/></ModalHeader>
		<ModalBody>
			<Stack direction="vertical" gap={2}>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Name:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							type="text"
							value={name}
							onChange={
								(e) => {
									setName(e.target.value);
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
							value={url}
							onChange={
								(e) => {
									setUrl(e.target.value);
								}
							}
						/>
					</Col>
				</Row>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label htmlFor="external">External:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Switch
							id="external"
							checked={external}
							onChange={
								(e) => {
									setExternal(e);
								}
							}
						/>
					</Col>
				</Row>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Width:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							type="text"
							value={width}
							onChange={
								(e) => {
									setWidth(e.target.value);
								}
							}
						/>
					</Col>
				</Row>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Height:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							type="text"
							value={height}
							onChange={
								(e) => {
									setHeight(e.target.value);
								}
							}
						/>
					</Col>
				</Row>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Resize:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<ResizeTypeSelect
							value={resizeType}
							onChange={
								(e) => {
									setResizeType(StringUtil.toString(e));
								}
							}
						/>
					</Col>
				</Row>
				<div className="m-auto">
					<ImagezImage
						name={name}
						type={resizeType}
						width={Number(NumberUtil.parseNumber(width))}
						height={Number(NumberUtil.parseNumber(height))}
						ext={ext}
					/>
				</div>
			</Stack>
		</ModalBody>
		<ModalFooter>
			<div className="m-auto">
				<Button onClick={generate} variant="success"><Localize text="Generate"/></Button>
			</div>
		</ModalFooter>
	</Modal>

}
