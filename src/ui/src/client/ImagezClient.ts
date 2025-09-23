import {HashUtil, RestClient, StringUtil} from "zavadil-ts-common";
import {ImageHealth, ImagezSettingsPayload} from "../types/Image";

export class ImagezClient extends RestClient {

	private secretToken: string;

	constructor(settings: ImagezSettingsPayload) {
		super(settings.baseUrl);
		this.secretToken = settings.secretToken;
	}

	getImagezResizedUrlByName(name: string, type: string, width: number, height: number, ext?: string): string {
		let raw = `${this.secretToken}-${name}-${type}-${width}-${height}`;
		if (StringUtil.notBlank(ext)) {
			raw += `-${ext}`;
		}
		const token = HashUtil.crc32hex(raw);
		return this.getUrl(
			`images/resized/${name}`,
			{type, width, height, ext, token}
		).toString()
	}

	uploadExternalUrl(url: string): Promise<ImageHealth> {
		return this.postJson('images/upload-url', null, {url, token: this.secretToken});
	}

}
