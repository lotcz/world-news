import {EnumSelect} from "zavadil-react-common";
import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";

export type ProcessingStateSelectProps = {
	value: string;
	onChange: (value?: string | null) => any;
}

export default function ProcessingStateSelect({value, onChange}: ProcessingStateSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<string>);

	useEffect(() => {
		restClient.enumerations.importType.get().then(setData);
	}, []);

	return <EnumSelect
		value={value}
		options={data}
		onChange={onChange}
	/>

}
