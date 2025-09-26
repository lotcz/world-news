import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useContext} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";

export type ArticleSourceSelectProps = {
	articleSourceId?: number | null;
	onChange: (articleSourceId?: number | null) => any;
}

export default function ArticleSourceSelect({articleSourceId, onChange}: ArticleSourceSelectProps) {
	const restClient = useContext(WnRestClientContext);

	return <AutocompleteEntityIdSelect
		id={articleSourceId}
		onChange={onChange}
		entityClient={restClient.articleSources}
	/>

}
