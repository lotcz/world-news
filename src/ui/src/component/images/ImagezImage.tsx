import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Img} from "./Img";
import {Image} from "../../types/Image";

export type ImagezImagePropsBase = {
	type: string;
	width: number;
	height: number;
	ext?: string;
};

export type ImagezImageByNameProps = ImagezImagePropsBase & {
	name?: string | null;
	verticalAlign?: string | null;
	horizontalAlign?: string | null;
};

export function ImagezImageByName({name, type, width, height, ext, verticalAlign, horizontalAlign}: ImagezImageByNameProps) {
	const restClient = useContext(WnRestClientContext);
	const [url, setUrl] = useState<string | null>(null);

	useEffect(
		() => {
			if (name) {
				restClient
					.images
					.getImagezResizedUrlByName(name, type, width, height, ext, verticalAlign, horizontalAlign)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, name, type, width, height, ext, verticalAlign, horizontalAlign]
	);

	return <Img url={url} maxWidth={width} maxHeight={height}/>
}

export type ImagezImageByIdProps = ImagezImagePropsBase & {
	id?: number | null;
};

export function ImagezImageById({id, type, width, height, ext}: ImagezImageByIdProps) {
	const restClient = useContext(WnRestClientContext);
	const [url, setUrl] = useState<string | null>(null);

	useEffect(
		() => {
			if (id) {
				restClient
					.images
					.getImagezResizedUrlById(id, type, width, height, ext)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, id, type, width, height, ext]
	);

	return <Img url={url} maxWidth={width} maxHeight={height}/>
}

export type ImagezImageProps = ImagezImageByNameProps & {
	image?: Image | null;
	id?: number | null;
};

export function ImagezImage({image, name, id, type, width, height, ext, verticalAlign, horizontalAlign}: ImagezImageProps) {
	if (id) return <ImagezImageById id={id} type={type} width={width} height={height} ext={ext}/>;
	if (image) return <ImagezImageByName
		type={type}
		ext={ext}
		name={image?.name}
		verticalAlign={image?.verticalAlign}
		horizontalAlign={image?.horizontalAlign}
		width={width}
		height={height}
	/>;
	return <ImagezImageByName
		type={type}
		ext={ext}
		name={name}
		width={width}
		height={height}
		verticalAlign={verticalAlign}
		horizontalAlign={horizontalAlign}
	/>;
}

export type ImagezImageResizedProps = {
	image?: Image | null;
	id?: number | null;
	name?: string | null;
	verticalAlign?: string | null;
	horizontalAlign?: string | null;
};

export function ImagezImageThumb({image, id, name, verticalAlign, horizontalAlign}: ImagezImageResizedProps) {
	return <ImagezImage
		image={image}
		id={id}
		name={name}
		verticalAlign={verticalAlign}
		horizontalAlign={horizontalAlign}
		type="crop"
		width={75}
		height={50}

	/>
}

export function ImagezImagePreview({image, id, name, verticalAlign, horizontalAlign}: ImagezImageResizedProps) {
	return <ImagezImage
		image={image}
		id={id}
		name={name}
		verticalAlign={verticalAlign}
		horizontalAlign={horizontalAlign}
		type="fit"
		width={600}
		height={200}
	/>
}
