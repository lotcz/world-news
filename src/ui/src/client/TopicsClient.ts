import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {TopicEmbeddingDistance} from "../types/EmbeddingDistance";
import {Topic, TopicStub} from "../types/Topic";

export class TopicsClient extends EntityClientWithStub<Topic, TopicStub> {

	constructor(client: RestClient) {
		super(client, `topics`);
	}

	loadByRealm(realmId: number, pr?: PagingRequest): Promise<Page<Topic>> {
		return this.client.getJson(`${this.name}/by-realm/${realmId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadSimilarToArticle(articleId: number): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-article/${articleId}`);
	}

	loadSimilarToTopic(topicId: number): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-topic/${topicId}`);
	}

	loadSimilarToRealm(realmId: number): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-realm/${realmId}`);
	}

}
