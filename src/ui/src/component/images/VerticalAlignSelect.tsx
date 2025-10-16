import {EnumSelect} from "zavadil-react-common";
import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {StringUtil} from "zavadil-ts-common";

export type VerticalAlignSelectProps = {
	value?: string | null;
	onChange: (value?: string | null) => any;
}

export default function VerticalAlignSelect({value, onChange}: VerticalAlignSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<string>);

	useEffect(() => {
		restClient.enumerations.verticalAlign.get().then(setData);
	}, []);

	return <EnumSelect
		value={value}
		options={data}
		showEmptyOption={true}
		onChange={(v) => onChange(StringUtil.blankToNull(v))}
	/>

}
