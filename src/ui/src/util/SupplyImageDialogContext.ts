import {createContext} from "react";
import {SupplyImageModalProps} from "../component/images/supply/SupplyImageModal";

export type SupplyImageDialogContextContent = {
	show: (props: SupplyImageModalProps) => any;
	hide: () => any;
};

export const SupplyImageDialogContext = createContext<SupplyImageDialogContextContent>(
	{
		show: (props) => null,
		hide: () => null
	}
);
