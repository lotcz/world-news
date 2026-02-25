import {LookupSelect} from "zavadil-react-common";
import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Language} from "../../types/Language";

export type LanguageIdSelectProps = {
	id?: number | null;
	onChange: (id?: number | null) => any;
}

export function LanguageIdSelect({id, onChange}: LanguageIdSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<Language>);

	useEffect(() => {
		restClient.languages.loadAll().then(setData);
	}, []);

	return <LookupSelect
		id={id}
		options={data}
		onChange={onChange}
	/>

}

export type LanguageSelectProps = {
	language?: Language | null;
	onChange: (language?: Language | null) => any;
}

export function LanguageSelect({language, onChange}: LanguageSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<Language>);

	useEffect(() => {
		restClient.languages.loadAll().then(setData);
	}, []);

	return <LookupSelect
		id={language?.id}
		options={data}
		onChange={
			(id) => {
				if (!id) {
					onChange(null);
					return;
				}
				restClient.languages.loadSingle(id).then(onChange);
			}
		}
	/>

}
