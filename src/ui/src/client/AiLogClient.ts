import {Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {AiLog} from "../types/AiLog";

export class AiLogClient {

	client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	filter(pr: PagingRequest, from?: Date | null, to?: Date | null): Promise<Page<AiLog>> {
		const params = PagingUtil.pagingRequestToQueryParams(pr);
		params.from = from?.toISOString();
		params.to = to?.toISOString();
		return this.client.getJson(`ai-log`, params);
	}

	loadByEntity(entityType: string, entityId: number, pr: PagingRequest): Promise<Page<AiLog>> {
		return this.client.getJson(`ai-log/by-entity/${entityType}/${entityId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadSingle(id: number): Promise<AiLog> {
		return this.client.getJson(`ai-log/${id}`);
	}

}
