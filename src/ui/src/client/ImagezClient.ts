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

	getImagezResizedUrlByName(
		name: string,
		type: string,
		width: number,
		height: number,
		ext?: string,
		verticalAlign?: string | null,
		horizontalAlign?: string | null
	): string {
		if (StringUtil.isBlank(type) || type === 'original') return this.getImagezOrignalUrlByName(name);

		let raw = `${this.secretToken}-${name}-${width}-${height}-${StringUtil.safeLowercase(type)}`;
		if (StringUtil.notBlank(ext)) {
			raw += `-${ext}`;
		}
		if (StringUtil.notBlank(verticalAlign)) {
			raw += `-${StringUtil.safeLowercase(verticalAlign)}`;
		}
		if (StringUtil.notBlank(horizontalAlign)) {
			raw += `-${StringUtil.safeLowercase(horizontalAlign)}`;
		}

		const token = HashUtil.crc32hex(raw);
		return this.getUrl(
			`images/resized/${name}`,
			{
				type: StringUtil.safeLowercase(type),
				width,
				height,
				ext,
				token,
				v: StringUtil.safeLowercase(verticalAlign),
				h: StringUtil.safeLowercase(horizontalAlign)
			}
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
