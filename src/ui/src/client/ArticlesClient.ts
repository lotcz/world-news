import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Article, ArticleStub} from "../types/Article";
import {ArticleEmbeddingDistance} from "../types/EmbeddingDistance";

export class ArticlesClient extends EntityClientWithStub<Article, ArticleStub> {

	constructor(client: RestClient) {
		super(client, 'articles');
	}

	search(pr: PagingRequest, published: boolean = false, internal: boolean = false): Promise<Page<Article>> {
		const params = PagingUtil.pagingRequestToQueryParams(pr);
		return this.client.getJson(this.name, {...params, published, internal});
	}

	loadAllByTopic(topicId: number, pr: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-topic/${topicId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadInternalByTopic(topicId: number, pr: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-topic/${topicId}/internal`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadExternalByTopic(topicId: number, pr: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-topic/${topicId}/external`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadBySource(sourceId: number, pr: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-source/${sourceId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadByTag(tagId: number, pr: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`${this.name}/by-tag/${tagId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadSimilarToArticle(articleId: number, size: number = 10): Promise<Array<ArticleEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-article/${articleId}`, {size});
	}

	loadSimilarToTopic(topicId: number, size: number = 10): Promise<Array<ArticleEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-topic/${topicId}`, {size});
	}

	moveToTopic(articleId: number, topicId: number): Promise<any> {
		return this.client.put(`${this.name}/${articleId}/move-to-topic`, undefined, {topicId});
	}

	approveForPublication(articleId: number): Promise<any> {
		return this.client.put(`${this.name}/${articleId}/approve-for-publication`);
	}

	rejectForPublication(articleId: number): Promise<any> {
		return this.client.put(`${this.name}/${articleId}/reject-for-publication`);
	}

	changeType(articleId: number, articleType: string): Promise<any> {
		return this.client.put(`${this.name}/${articleId}/change-type/${articleType}`);
	}
}
