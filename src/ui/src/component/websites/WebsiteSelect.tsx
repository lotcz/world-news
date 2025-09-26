import {LookupSelect} from "zavadil-react-common";
import {useContext, useEffect, useState} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";
import {Website} from "../../types/Website";

export type WebsiteIdSelectProps = {
	id?: number | null;
	onChange: (id?: number | null) => any;
}

export function WebsiteIdSelect({id, onChange}: WebsiteIdSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<Website>);

	useEffect(() => {
		restClient.websites.loadAll().then(setData);
	}, []);

	return <LookupSelect
		id={id}
		options={data}
		onChange={onChange}
	/>

}

export type WebsiteSelectProps = {
	website?: Website | null;
	onChange: (website?: Website | null) => any;
}

export function WebsiteSelect({website, onChange}: WebsiteSelectProps) {
	const restClient = useContext(WnRestClientContext);
	const [data, setData] = useState(Array<Website>);

	useEffect(() => {
		restClient.websites.loadAll().then(setData);
	}, []);

	return <LookupSelect
		id={website?.id}
		options={data}
		onChange={
			(id) => {
				if (!id) {
					onChange(null);
					return;
				}
				restClient.websites.loadSingle(id).then(onChange);
			}
		}
	/>

}
