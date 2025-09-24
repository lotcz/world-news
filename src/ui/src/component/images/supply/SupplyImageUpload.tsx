import React, {useCallback, useContext, useState} from 'react';
import {WnRestClientContext} from "../../../client/WnRestClient";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {SaveButton} from "zavadil-react-common";
import {Form} from "react-bootstrap";

export type SupplyImageUploadProps = {
	onSelected: (name: string) => any;
}

export function SupplyImageUpload({onSelected}: SupplyImageUploadProps) {
	const restClient = useContext(WnRestClientContext);
	const alerts = useContext(WnUserAlertsContext);
	const [uploading, setUploading] = useState<boolean>(false);
	const [file, setFile] = useState<File>();

	const upload = useCallback(
		() => {
			if (!file) return;
			setUploading(true);
			restClient.images
				.uploadFile(file)
				.then((ih) => onSelected(ih.name))
				.catch(
					(e) => {
						setUploading(false);
						alerts.err(e);
					});
		},
		[restClient, alerts, onSelected, file]
	);

	return (
		<div>
			<div>
				<Form>
					<Form.Control
						type="file"
						onChange={(e) => {
							setFile(undefined);
							const filelist = (e.target as HTMLInputElement).files;
							if (!filelist) {
								alerts.err("No files selected!");
								return;
							}
							const file = filelist.item(0);
							if (!file) {
								alerts.err("No file selected!");
								return;
							}
							setFile(file);
						}}
					/>
				</Form>

			</div>
			<div className="text-center mt-2">
				<SaveButton
					size="lg"
					loading={uploading}
					onClick={upload}
					disabled={file === undefined}
				>Upload</SaveButton>
			</div>
		</div>
	);
}

