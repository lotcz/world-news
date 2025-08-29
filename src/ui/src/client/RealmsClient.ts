import {LookupClient, RestClient} from "zavadil-ts-common";
import {RealmEmbeddingDistance} from "../types/EmbeddingDistance";
import {Realm} from "../types/Realm";

export class RealmsClient extends LookupClient<Realm> {

	constructor(client: RestClient) {
		super(client, `realms`);
	}

	loadSimilarToTopic(topicId: number): Promise<Array<RealmEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-topic/${topicId}`);
	}

}
