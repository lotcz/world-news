import {LookupClient, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ArticleSource} from "../types/ArticleSource";

export class ArticleSourcesClient extends LookupClient<ArticleSource> {

	constructor(client: RestClient) {
		super(client, `article-sources`);
	}

	loadFiltered(countryId: number | null | undefined, languageId: number | null | undefined, pr?: PagingRequest): Promise<Page<ArticleSource>> {
		const params = PagingUtil.pagingRequestToQueryParams(pr);
		return this.client.getJson(`${this.name}`, {...params, countryId, languageId});
	}

}
