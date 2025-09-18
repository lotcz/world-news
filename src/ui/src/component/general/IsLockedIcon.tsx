import {BsLockFill} from "react-icons/bs";

export type LockedIconProps = {
	locked: boolean;
};

function IsLockedIcon({locked}: LockedIconProps) {
	if (!locked) return <></>
	return <BsLockFill color="red"/>
}

export default IsLockedIcon;
