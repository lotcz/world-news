import {EnumSelect} from "zavadil-react-common";
import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";

export type ResizeTypeSelectProps = {
	value: string;
	onChange: (value?: string | null) => any;
}

export default function ResizeTypeSelect({value, onChange}: ResizeTypeSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<string>);

	useEffect(() => {
		restClient.enumerations.resizeType.get().then(setData);
	}, []);

	return <EnumSelect
		value={value}
		options={data}
		onChange={onChange}
		showEmptyOption={true}
	/>

}
