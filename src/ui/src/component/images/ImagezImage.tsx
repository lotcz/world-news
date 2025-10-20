import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Img} from "./Img";

export type ImagezImageProps = {
	id?: number | null;
	name?: string | null;
	type: string;
	width: number;
	height: number;
	ext?: string;
	verticalAlign?: string | null;
	horizontalAlign?: string | null;
};

export function ImagezImage({id, name, type, width, height, ext, verticalAlign, horizontalAlign}: ImagezImageProps) {
	const restClient = useContext(WnRestClientContext);
	const [url, setUrl] = useState<string | null>(null);

	useEffect(
		() => {
			if (id) {
				restClient
					.images
					.getImagezResizedUrlById(id, type, width, height, ext)
					.then(setUrl);
			} else if (name) {
				restClient
					.images
					.getImagezResizedUrlByName(name, type, width, height, ext, verticalAlign, horizontalAlign)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, id, name, type, width, height, ext, verticalAlign, horizontalAlign]
	);

	return <Img url={url} maxWidth={width} maxHeight={height}/>
}

export type ImagezImageResizedProps = {
	id?: number | null;
	name?: string | null;
	verticalAlign?: string | null;
	horizontalAlign?: string | null;
};

export function ImagezImageThumb({id, name, verticalAlign, horizontalAlign}: ImagezImageResizedProps) {
	return <ImagezImage id={id} name={name} type="crop" width={75} height={50} verticalAlign={verticalAlign} horizontalAlign={horizontalAlign}/>
}

export function ImagezImagePreview({id, name, verticalAlign, horizontalAlign}: ImagezImageResizedProps) {
	return <ImagezImage id={id} name={name} type="fit" width={600} height={200} verticalAlign={verticalAlign} horizontalAlign={horizontalAlign}/>
}
