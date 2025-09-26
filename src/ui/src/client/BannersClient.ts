import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Banner, BannerStub} from "../types/Banner";

export class BannersClient extends EntityClientWithStub<Banner, BannerStub> {

	constructor(client: RestClient) {
		super(client, `banners`);
	}

	loadByWebsite(websiteId: number, pr?: PagingRequest): Promise<Page<Banner>> {
		return this.client.getJson(`${this.name}/by-website/${websiteId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

}
