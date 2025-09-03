import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useContext} from "react";
import {WnRestClientContext} from "../../client/WnRestClient";

export type RealmSelectProps = {
	realmId?: number | null;
	onChange: (realmId?: number | null) => any;
}

export default function RealmSelect({realmId, onChange}: RealmSelectProps) {
	const restClient = useContext(WnRestClientContext);

	return <AutocompleteEntityIdSelect
		id={realmId}
		onChange={onChange}
		entityClient={restClient.realms}
	/>

}
