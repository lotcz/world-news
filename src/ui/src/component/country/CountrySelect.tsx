import {LookupSelect} from "zavadil-react-common";
import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Country} from "../../types/Country";

export type CountryIdSelectProps = {
	showEmptyOption?: boolean;
	id?: number | null;
	onChange: (id?: number | null) => any;
}

export function CountryIdSelect({showEmptyOption, id, onChange}: CountryIdSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<Country>);

	useEffect(() => {
		restClient.countries.loadAll().then(setData)
	}, []);

	return <LookupSelect
		showEmptyOption={showEmptyOption}
		id={id}
		options={data}
		onChange={onChange}
	/>

}

export type CountrySelectProps = {
	country?: Country | null;
	onChange: (country?: Country | null) => any;
}

export function CountrySelect({country, onChange}: CountrySelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<Country>);

	useEffect(() => {
		restClient.countries.loadAll().then(setData);
	}, []);

	return <LookupSelect
		id={country?.id}
		options={data}
		onChange={
			(id) => {
				if (!id) {
					onChange(null);
					return;
				}
				restClient.countries.loadSingle(id).then(onChange);
			}
		}
	/>

}
