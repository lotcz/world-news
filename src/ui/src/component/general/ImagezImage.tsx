import {useContext, useEffect, useState} from "react";
import {Spinner} from "react-bootstrap";
import {WnRestClientContext} from "../../client/WnRestClient";

export type ImagezImageProps = {
	name: string;
	type: string;
	width: number;
	height: number;
	ext?: string;
};

function ImagezImage({name, type, width, height, ext}: ImagezImageProps) {
	const restClient = useContext(WnRestClientContext);
	const [url, setUrl] = useState<string>();

	useEffect(
		() => {
			restClient
				.getImagezResizedUrl(name, type, width, height, ext)
				.then(setUrl)
		},
		[restClient, name, type, width, height, ext]
	);

	if (!url) return <Spinner size="sm"/>

	return <img className="img img-thumbnail" src={url} alt="thumb"/>
}

export default ImagezImage;
