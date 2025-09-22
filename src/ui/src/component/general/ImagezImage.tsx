import {useContext, useEffect, useState} from "react";
import {Spinner} from "react-bootstrap";
import {WnRestClientContext} from "../../client/WnRestClient";
import {BsImage} from "react-icons/bs";

export type ImagezImageUrlProps = {
	url?: string | null;
};

export function ImagezImageUrl({url}: ImagezImageUrlProps) {
	if (url === undefined) return <Spinner size="sm"/>
	if (url === null) return <BsImage size="15"/>
	return <img className="img img-thumbnail" src={url} alt="imagez"/>
}

export type ImagezImageBasicProps = {
	type: string;
	width: number;
	height: number;
	ext?: string;
};

export type ImagezImageNameProps = ImagezImageBasicProps & {
	name?: string | null;
};

export function ImagezImageName({name, type, width, height, ext}: ImagezImageNameProps) {
	const restClient = useContext(WnRestClientContext);
	const [url, setUrl] = useState<string | null>(null);

	useEffect(
		() => {
			if (!name) {
				setUrl(null);
				return;
			}
			restClient
				.images
				.getImagezResizedUrlByName(name, type, width, height, ext)
				.then(setUrl)
		},
		[restClient, name, type, width, height, ext]
	);

	return <ImagezImageUrl url={url}/>
}

export type ImagezImageIdProps = ImagezImageBasicProps & {
	id?: number | null;
};

export function ImagezImageId({id, type, width, height, ext}: ImagezImageIdProps) {
	const restClient = useContext(WnRestClientContext);
	const [url, setUrl] = useState<string | null>(null);

	useEffect(
		() => {
			if (!id) {
				setUrl(null);
				return;
			}
			restClient
				.images
				.getImagezResizedUrlById(id, type, width, height, ext)
				.then(setUrl)
		},
		[restClient, id, type, width, height, ext]
	);

	return <ImagezImageUrl url={url}/>
}


export type ImagezImageThumbProps = {
	name?: string | null;
};

export function ImagezImageThumb({name}: ImagezImageThumbProps) {
	return <ImagezImageName name={name} type={"crop"} width={75} height={50}/>
}

export type ImagezImagePreviewProps = {
	id?: number | null;
};

export function ImagezImagePreview({id}: ImagezImagePreviewProps) {
	return <ImagezImageId id={id} type="fit" width={600} height={200}/>
}
