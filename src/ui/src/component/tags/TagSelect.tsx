import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useContext} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";

export type TagSelectProps = {
	tagId?: number | null;
	onChange: (tagId?: number | null) => any;
}

export default function TagSelect({tagId, onChange}: TagSelectProps) {
	const restClient = useContext(WnRestClientContext);

	return <AutocompleteEntityIdSelect
		id={tagId}
		onChange={onChange}
		entityClient={restClient.tags}
	/>

}
