import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Article, ArticleStub} from "../types/Article";
import {ArticleEmbeddingDistance} from "../types/EmbeddingDistance";

export class ArticlesClient extends EntityClientWithStub<Article, ArticleStub> {

	constructor(client: RestClient) {
		super(client, `articles`);
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

	loadSimilarToArticle(articleId: number): Promise<Array<ArticleEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-article/${articleId}`);
	}

	loadSimilarToTopic(topicId: number): Promise<Array<ArticleEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-topic/${topicId}`);
	}

}
