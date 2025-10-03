import {LazyAsync, RestClient} from "zavadil-ts-common";

export class EnumerationsClient {

	private client: RestClient;

	public importType: LazyAsync<string[]>;

	public bannerType: LazyAsync<string[]>;

	public processingState: LazyAsync<string[]>;

	public articleType: LazyAsync<string[]>;

	constructor(client: RestClient) {
		this.client = client;

		this.importType = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/import-type')
		);

		this.bannerType = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/banner-type')
		);

		this.processingState = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/processing-state')
		);

		this.articleType = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/article-type')
		);

	}

}
