import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {TopicEmbeddingDistance} from "../types/EmbeddingDistance";
import {Topic, TopicStub} from "../types/Topic";

export class TopicsClient extends EntityClientWithStub<Topic, TopicStub> {

	constructor(client: RestClient) {
		super(client, 'topics');
	}

	search(published: boolean, pr?: PagingRequest): Promise<Page<Topic>> {
		const params = PagingUtil.pagingRequestToQueryParams(pr);
		return this.client.getJson(this.name, {...params, published});
	}

	loadByRealm(realmId: number, pr?: PagingRequest): Promise<Page<Topic>> {
		return this.client.getJson(`${this.name}/by-realm/${realmId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadSimilarToArticle(articleId: number, size: number = 10): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-article/${articleId}`, {size});
	}

	loadSimilarToTopic(topicId: number, size: number = 10): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-topic/${topicId}`, {size});
	}

	loadSimilarToRealm(realmId: number): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-realm/${realmId}`);
	}

	mergeTopics(fromTopicId: number, toTopicId: number): Promise<any> {
		return this.client.put(`${this.name}/${fromTopicId}/merge-into`, undefined, {topicId: toTopicId});
	}

	unpublishAndLock(topicId: number): Promise<any> {
		return this.client.put(`${this.name}/${topicId}/unpublish-and-lock`);
	}

	approveForCompilation(topicId: number): Promise<any> {
		return this.client.put(`${this.name}/${topicId}/approve-for-compilation`);
	}

	rejectForCompilation(topicId: number): Promise<any> {
		return this.client.put(`${this.name}/${topicId}/reject-for-compilation`);
	}

	changeType(topicId: number, articleType: string): Promise<any> {
		return this.client.put(`${this.name}/${topicId}/change-type/${articleType}`);
	}

	changeImage(topicId: number, imageId: number | null, illustrative: boolean): Promise<any> {
		return this.client.put(`${this.name}/${topicId}/change-image/${imageId}/${illustrative}`);
	}

}
