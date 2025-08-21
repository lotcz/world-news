import {LazyAsync, RestClient} from "zavadil-ts-common";

export class EnumerationsClient {

	private client: RestClient;

	public importType: LazyAsync<string[]>;

	public processingState: LazyAsync<string[]>;

	constructor(client: RestClient) {
		this.client = client;

		this.importType = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/import-type')
		);

		this.processingState = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/processing-state')
		);

	}

}
