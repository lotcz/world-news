import {RestClient} from "zavadil-ts-common";

export class ImagesClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	getImagezResizedUrlByName(name: string, type: string, width: number, height: number, ext?: string): Promise<string> {
		return this.client.get(`images/imagez/url/resized/by-name/${name}`, {type, width, height, ext})
			.then(r => r.text());
	}

	getImagezResizedUrlById(id: number, type: string, width: number, height: number, ext?: string): Promise<string> {
		return this.client.get(`images/imagez/url/resized/by-id/${id}`, {type, width, height, ext})
			.then(r => r.text());
	}

}
