import React, {useState} from 'react';
import {SaveButton} from "zavadil-react-common";
import {Form} from "react-bootstrap";
import {Img} from "../Img";
import {StringUtil} from "zavadil-ts-common";

export type SupplyImageUrlProps = {
	onSelected: (url: string) => any;
}

export function SupplyImageUrl({onSelected}: SupplyImageUrlProps) {
	const [uploading, setUploading] = useState<boolean>(false);
	const [preivewUrl, setPreviewUrl] = useState<string>();

	return (
		<div>
			<div className="p-4">
				<div className="p-2 text-center">
					{
						preivewUrl && <Img url={preivewUrl} maxHeight={600} maxWidth={800}/>
					}
				</div>
				<Form>
					<Form.Label>URL:</Form.Label>
					<Form.Control
						type="text"
						value={preivewUrl}
						onChange={(e) => {
							setPreviewUrl(e.target.value)
						}}
					/>
				</Form>
			</div>
			<div className="text-center m-2">
				<SaveButton
					size="lg"
					loading={uploading}
					onClick={() => preivewUrl && onSelected(preivewUrl)}
					disabled={StringUtil.isBlank(preivewUrl)}
				>Upload</SaveButton>
			</div>
		</div>
	);
}

