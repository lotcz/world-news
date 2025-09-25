import React, {useCallback, useContext, useState} from 'react';
import {WnRestClientContext} from "../../../client/WnRestClient";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {LoadingButton, SaveButton} from "zavadil-react-common";
import {Form, FormGroup, Spinner} from "react-bootstrap";
import {ImageHealth} from "../../../types/Image";
import {StringUtil} from "zavadil-ts-common";
import {GiArtificialIntelligence} from "react-icons/gi";
import {BsTrash} from "react-icons/bs";
import {ImagezImageHealthPreview} from "../ImagezImageHealthPreview";

export type SupplyImageGenerateWithAiProps = {
	onSelected: (name: string) => any;
	description?: string | null;
	entityType?: string | null;
	entityId?: number | null;
}

export function SupplyImageGenerateWithAi({onSelected, description, entityType, entityId}: SupplyImageGenerateWithAiProps) {
	const restClient = useContext(WnRestClientContext);
	const alerts = useContext(WnUserAlertsContext);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [generating, setGenerating] = useState<boolean>(false);
	const [systemPrompt, setSystemPrompt] = useState<string>("Vytvoř obrázek, který bude doprovázet následující článek:");
	const [userPrompt, setUserPrompt] = useState<string>(StringUtil.toString(description));
	const [preview, setPreview] = useState<ImageHealth>();

	const generate = useCallback(
		() => {
			if (preview) {
				setDeleting(true);
				restClient.images
					.deleteImagezImage(preview.name)
					.then(() => setDeleting(false))
					.catch((e) => alerts.err(e));
			}
			setGenerating(true);
			restClient.images
				.generateImage(systemPrompt, userPrompt, entityType, entityId)
				.then(setPreview)
				.catch((e) => alerts.err(e))
				.finally(() => setGenerating(false));
		},
		[restClient, alerts, systemPrompt, userPrompt, entityType, entityId, preview]
	);

	return (
		<div>
			<div className="w-75 m-auto">
				<Form>
					<FormGroup>
						<Form.Label>System prompt:</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={systemPrompt}
							onChange={(e) => setSystemPrompt(StringUtil.toString(e.target.value))}
						/>
					</FormGroup>
					<FormGroup>
						<Form.Label>User prompt:</Form.Label>
						<Form.Control
							as="textarea"
							rows={6}
							value={userPrompt}
							onChange={(e) => setUserPrompt(StringUtil.toString(e.target.value))}
						/>
					</FormGroup>
				</Form>
			</div>
			<div className="text-center m-2">
				<LoadingButton
					icon={<GiArtificialIntelligence/>}
					size="lg"
					variant="success"
					loading={generating}
					onClick={generate}
					disabled={generating}
				>Generate</LoadingButton>
				{
					deleting && <div className="d-flex align-items-center gap-2">
						<BsTrash/>
						<Spinner size="sm"/>
					</div>
				}
			</div>
			<div className="text-center m-2">
				{
					preview && <ImagezImageHealthPreview health={preview} width={650} height={450}/>
				}
			</div>
			<div className="text-center m-2">
				<SaveButton
					size="lg"
					onClick={() => preview && onSelected(preview.name)}
					disabled={preview === undefined}
				>Upload</SaveButton>
			</div>
		</div>
	);
}
