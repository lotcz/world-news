import {BsEyeSlash} from "react-icons/bs";

export type IsHiddenIconProps = {
	hidden: boolean;
};

function IsHiddenIcon({hidden}: IsHiddenIconProps) {
	if (!hidden) return <></>
	return <BsEyeSlash color="orange"/>
}

export default IsHiddenIcon;
