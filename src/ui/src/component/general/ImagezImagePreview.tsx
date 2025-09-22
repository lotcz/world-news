import ImagezImage from "./ImagezImage";

export type ImagezImagePreviewProps = {
	name: string;
};

function ImagezImagePreview({name}: ImagezImagePreviewProps) {
	return <ImagezImage name={name} type="fit" width={600} height={200}/>
}

export default ImagezImagePreview;
