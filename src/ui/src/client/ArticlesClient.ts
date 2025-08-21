import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Article, ArticleStub} from "../types/Article";

export class ArticlesClient extends EntityClientWithStub<Article, ArticleStub> {

	constructor(client: RestClient) {
		super(client, `articles`);
	}

	loadByTopic(topicId: number, pr: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-topic/${topicId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

}
