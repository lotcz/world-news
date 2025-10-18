import {Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {QueueSizes} from "../types/Stats";
import {Topic} from "../types/Topic";
import {Article} from "../types/Article";

export class QueuesClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	startIngestion(): Promise<Response> {
		return this.client.post('queues/ingest/start');
	}

	startIngestionBySource(sourceId: number): Promise<Response> {
		return this.client.post(`queues/ingest/start/${sourceId}`);
	}

	loadTopicApprovalQueue(p: PagingRequest): Promise<Page<Topic>> {
		return this.client.getJson(`queues/topic/approval-queue`, PagingUtil.pagingRequestToQueryParams(p));
	}

	loadTopicSupplyImageQueue(p: PagingRequest): Promise<Page<Topic>> {
		return this.client.getJson(`queues/topic/image-supply-queue`, PagingUtil.pagingRequestToQueryParams(p));
	}

	loadArticleApprovalQueue(p: PagingRequest): Promise<Page<Article>> {
		return this.client.getJson(`queues/article/approval-queue`, PagingUtil.pagingRequestToQueryParams(p));
	}

	loadSizes(): Promise<QueueSizes> {
		return this.client.getJson(`queues/sizes`);
	}

}
