import {EntityClientWithStub, RestClient} from "zavadil-ts-common";
import {TopicEmbeddingDistance} from "../types/EmbeddingDistance";
import {Topic, TopicStub} from "../types/Topic";

export class TopicsClient extends EntityClientWithStub<Topic, TopicStub> {

	constructor(client: RestClient) {
		super(client, `topics`);
	}

	loadSimilarToArticle(articleId: number): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-article/${articleId}`);
	}

	loadSimilarToTopic(topicId: number): Promise<Array<TopicEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-topic/${topicId}`);
	}

}
