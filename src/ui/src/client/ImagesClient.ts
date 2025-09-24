import {EntityClient, LazyAsync, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Image, ImageHealth, ImageSearchResult, ImagezSettingsPayload} from "../types/Image";
import {ImagezClient} from "./ImagezClient";

export class ImagesClient extends EntityClient<Image> {

	private imagez: LazyAsync<ImagezClient>;

	constructor(client: RestClient) {
		super(client, 'images');
		this.imagez = new LazyAsync<ImagezClient>(
			() => this.getImagezSettings().then((settings) => new ImagezClient(settings))
		);
	}

	// Imagez via proxy

	getImagezSettings(): Promise<ImagezSettingsPayload> {
		return this.client.getJson(`${this.name}/imagez/settings`);
	}

	getImagezResizedUrlByNameViaProxy(name: string, type: string, width: number, height: number, ext?: string): Promise<string> {
		return this.client.get(`${this.name}/imagez/url/resized/by-name/${name}`, {type, width, height, ext})
			.then(r => r.text());
	}

	getImagezResizedUrlById(id: number, type: string, width: number, height: number, ext?: string): Promise<string> {
		return this.client.get(`${this.name}/imagez/url/resized/by-id/${id}`, {type, width, height, ext})
			.then(r => r.text());
	}

	// Imagez direct

	getImagezResizedUrlByName(name: string, type: string, width: number, height: number, ext?: string): Promise<string> {
		return this.imagez.get().then((imagez) => imagez.getImagezResizedUrlByName(name, type, width, height, ext));
	}

	uploadExternalUrl(url: string): Promise<ImageHealth> {
		return this.imagez.get().then((imagez) => imagez.uploadExternalUrl(url));
	}

	uploadFile(f: File): Promise<ImageHealth> {
		return this.imagez.get().then((imagez) => imagez.uploadFile(f));
	}

	// CC

	searchCreativeCommons(pr: PagingRequest): Promise<Page<ImageSearchResult>> {
		return this.client.getJson(`${this.name}/cc/search`, PagingUtil.pagingRequestToQueryParams(pr));
	}

}
