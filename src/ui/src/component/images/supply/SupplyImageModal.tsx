import React, {useCallback, useContext, useState} from 'react';
import {Modal, Tab, Tabs} from 'react-bootstrap';
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import FindImagesCreativeCommons from "./FindImagesCreativeCommons";
import {Image} from "../../../types/Image";
import {SupplyImagePreview} from "./SupplyImagePreview";
import {WnRestClientContext} from "../../../client/WnRestClient";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";

const DEFAULT_TAB = 'commons';

export type SupplyImageModalProps = {
	keywords?: Array<string> | null;
	description?: string | null;
	onClose: () => any;
	onSelected: (imageId: number) => any;
}

export function SupplyImageModal({onClose, onSelected, keywords, description}: SupplyImageModalProps) {
	const restClient = useContext(WnRestClientContext);
	const alerts = useContext(WnUserAlertsContext);
	const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB);
	const [preview, setPreview] = useState<Image>();

	const saveImage = useCallback(
		(image: Image) => {
			if (StringUtil.isBlank(image.name)) {
				alerts.err("Image name empty!")
				return;
			}
			restClient
				.images
				.save(image)
				.then(
					(saved) => {
						if (NumberUtil.notEmpty(saved.id)) {
							onSelected(saved.id);
						} else {
							alerts.err("Image ID empty!")
							return;
						}
					});
		},
		[restClient, alerts, onSelected]
	);

	return (
		<Modal show={true} onHide={onClose} size="xl">
			<Modal.Header closeButton>
				<Modal.Title>Supply an image</Modal.Title>
			</Modal.Header>
			<Modal.Body className="pt-2 pb-0 px-0">
				<Tabs
					activeKey={activeTab}
					onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
				>
					<Tab eventKey="commons" title="Creative Commons"/>
					<Tab eventKey="chatgpt" title="ChatGPT"/>
					<Tab eventKey="upload" title="Upload"/>
					{
						preview && <Tab eventKey="preview" title="Preview"/>
					}
				</Tabs>
				<div className="p-2">
					<div>
						{
							activeTab === "commons" && <FindImagesCreativeCommons
								onSelected={
									(i) => {
										setPreview(i);
										setActiveTab("preview");
									}
								}/>
						}
						{
							activeTab === "chatgpt" && <div>ChatGPT</div>
						}
						{
							activeTab === "upload" && <div>Upload</div>
						}
						{
							activeTab === "preview" && preview && <SupplyImagePreview
								image={preview}
								onChange={(i) => setPreview({...i})}
								onConfirmed={saveImage}
							/>
						}
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}

