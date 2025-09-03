import {LookupClient, RestClient} from "zavadil-ts-common";
import {RealmEmbeddingDistance} from "../types/EmbeddingDistance";
import {Realm, RealmTree} from "../types/Realm";

export class RealmsClient extends LookupClient<Realm> {

	constructor(client: RestClient) {
		super(client, `realms`);
	}

	loadSimilarToTopic(topicId: number): Promise<Array<RealmEmbeddingDistance>> {
		return this.client.getJson(`${this.name}/similar-to-topic/${topicId}`);
	}

	loadTree(): Promise<RealmTree> {
		return this.client.getJson(`${this.name}/tree`);
	}

	loadChildren(realmId: number): Promise<Array<Realm>> {
		return this.client.getJson(`${this.name}/${realmId}/children`);
	}
}
