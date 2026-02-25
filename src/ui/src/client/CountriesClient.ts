import {LookupClient, RestClient} from "zavadil-ts-common";
import {Country} from "../types/Country";

export class CountriesClient extends LookupClient<Country> {

	constructor(client: RestClient) {
		super(client, `countries`);
	}

}
