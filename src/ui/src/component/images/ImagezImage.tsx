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
};

export function ImagezImage({id, name, type, width, height, ext}: ImagezImageProps) {
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
					.getImagezResizedUrlByName(name, type, width, height, ext)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, id, name, type, width, height, ext]
	);

	return <Img url={url}/>
}

export type ImagezImageResizedProps = {
	id?: number | null;
	name?: string | null;
};

export function ImagezImageThumb({id, name}: ImagezImageResizedProps) {
	return <ImagezImage id={id} name={name} type="crop" width={75} height={50}/>
}

export function ImagezImagePreview({id, name}: ImagezImageResizedProps) {
	return <ImagezImage id={id} name={name} type="fit" width={600} height={200}/>
}
