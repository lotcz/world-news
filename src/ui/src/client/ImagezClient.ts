import {HashUtil, RestClient, StringUtil} from "zavadil-ts-common";
import {ImageHealth, ImagezSettingsPayload} from "../types/Image";

export class ImagezClient extends RestClient {

	private secretToken: string;

	constructor(settings: ImagezSettingsPayload) {
		super(settings.baseUrl);
		this.secretToken = settings.secretToken;
	}

	getImagezOrignalUrlByName(name: string): string {
		return this.getUrl(`images/original/${name}`).toString()
	}

	getImagezResizedUrlByName(name: string, type: string, width: number, height: number, ext?: string): string {
		if (type === 'original') return this.getImagezOrignalUrlByName(name);
		
		let raw = `${this.secretToken}-${name}-${width}-${height}-${type}`;
		if (StringUtil.notBlank(ext)) {
			raw += `-${ext}`;
		}
		const token = HashUtil.crc32hex(raw);
		return this.getUrl(
			`images/resized/${name}`,
			{type, width, height, ext, token}
		).toString()
	}

	loadImageHealth(name: string): Promise<ImageHealth> {
		return this.postJson(`images/health/${name}`);
	}

	uploadExternalUrl(url: string): Promise<ImageHealth> {
		return this.postJson('images/upload-url', null, {url, token: this.secretToken});
	}

	uploadFile(f: File): Promise<ImageHealth> {
		let formData = new FormData();
		formData.append("image", f);
		return this.postFormJson('images/upload', formData, {token: this.secretToken});
	}

	deleteImage(name: string): Promise<any> {
		return this.del(`images/original/${name}`, {token: this.secretToken});
	}
}
