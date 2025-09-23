import React, {useCallback, useContext, useState} from 'react';
import {Image} from "../../../types/Image";
import ImageForm from "../ImageForm";
import {WnRestClientContext} from "../../../client/WnRestClient";
import {StringUtil} from "zavadil-ts-common";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {SaveButton} from "zavadil-react-common";

export type SupplyImagePreviewProps = {
	image: Image;
	onChange: (image: Image) => any;
	onConfirmed: (image: Image) => any;
}

export function SupplyImagePreview({image, onChange, onConfirmed}: SupplyImagePreviewProps) {
	const restClient = useContext(WnRestClientContext);
	const alerts = useContext(WnUserAlertsContext);
	const [saving, setSaving] = useState<boolean>(false);

	const save = useCallback(
		() => {
			if (StringUtil.isBlank(image.name)) {
				if (StringUtil.isBlank(image.originalUrl)) {
					alerts.err("Neither name or url provided!")
					return;
				}
				setSaving(true);
				restClient
					.images
					.uploadExternalUrl(image.originalUrl)
					.then(
						(health) => {
							image.name = health.name;
							onConfirmed(image);
						}
					)
					.catch((e) => alerts.err(e))
					.finally(() => setSaving(false));
			} else {
				onConfirmed(image);
			}
		},
		[restClient, alerts, onConfirmed, image]
	);

	return (
		<div>
			<div>
				<ImageForm data={image} onChange={onChange}/>
			</div>
			<div className="text-center mt-2">
				<SaveButton loading={saving} size="lg" onClick={save}>Save</SaveButton>
			</div>
		</div>
	);
}

