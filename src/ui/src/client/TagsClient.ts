import {EntityClientWithStub, RestClient} from "zavadil-ts-common";
import {Tag, TagStub} from "../types/Tag";

export class TagsClient extends EntityClientWithStub<Tag, TagStub> {

	constructor(client: RestClient) {
		super(client, `tags`);
	}

	loadByArticle(articleId: number): Promise<Array<Tag>> {
		return this.client.getJson(`${this.name}/by-article/${articleId}`);
	}

}
