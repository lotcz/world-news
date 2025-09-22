import ImagezImage from "./ImagezImage";

export type ImagezImageThumbProps = {
	name: string;
};

function ImagezImageThumb({name}: ImagezImageThumbProps) {
	return <ImagezImage name={name} type={"crop"} width={75} height={50}/>
}

export default ImagezImageThumb;
