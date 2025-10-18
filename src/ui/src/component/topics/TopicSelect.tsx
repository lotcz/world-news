import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useContext} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";

export type TopicSelectProps = {
	topicId?: number | null;
	onChange: (topicId?: number | null) => any;
}

export default function TopicSelect({topicId, onChange}: TopicSelectProps) {
	const restClient = useContext(WnRestClientContext);

	return <AutocompleteEntityIdSelect
		id={topicId}
		onChange={onChange}
		entityClient={restClient.topics}
	/>

}
