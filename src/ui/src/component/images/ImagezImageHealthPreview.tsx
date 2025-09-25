import {ImagezImage} from "./ImagezImage";
import {ImageHealth} from "../../types/Image";

export type ImagezImageHealthPreviewProps = {
	health: ImageHealth;
	width: number;
	height: number;
};

export function ImagezImageHealthPreview({health, width, height}: ImagezImageHealthPreviewProps) {
	return <div>
		<div>
			<ImagezImage name={health.name} type="fit" width={width} height={height}/>
		</div>
		<div>
			{health.mime}: {health.width} x {health.height}
		</div>
	</div>
}
