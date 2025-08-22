import {Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {AiLog} from "../types/AiLog";

export class AiLogClient {

	client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	filter(pr: PagingRequest, from?: Date | null, to?: Date | null): Promise<Page<AiLog>> {
		const params = PagingUtil.pagingRequestToQueryParams(pr);
		params.from = from;
		params.to = to;
		return this.client.getJson(`ai-log`, params);
	}

}
