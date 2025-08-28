import {createContext} from "react";
import conf from "../config/conf.json";
import {LookupClient, RestClientWithOAuth} from "zavadil-ts-common";
import {Language} from "../types/Language";
import {ClientStats, WnStats} from "../types/Stats";
import {Realm} from "../types/Realm";
import {ArticleSource} from "../types/ArticleSource";
import {EnumerationsClient} from "./EnumerationsClient";
import {ArticlesClient} from "./ArticlesClient";
import {AiLogClient} from "./AiLogClient";
import {TagsClient} from "./TagsClient";
import {TopicsClient} from "./TopicsClient";

export class WnRestClient extends RestClientWithOAuth {

	public enumerations: EnumerationsClient;

	public languages: LookupClient<Language>;

	public realms: LookupClient<Realm>;

	public articleSources: LookupClient<ArticleSource>;

	public topics: TopicsClient;

	public tags: TagsClient;

	public articles: ArticlesClient;

	public aiLog: AiLogClient;

	constructor() {
		super(conf.API_URL);

		this.enumerations = new EnumerationsClient(this);
		this.languages = new LookupClient<Language>(this, 'languages');
		this.realms = new LookupClient<Realm>(this, 'realms');
		this.articleSources = new LookupClient<ArticleSource>(this, 'article-sources');
		this.topics = new TopicsClient(this);
		this.tags = new TagsClient(this);
		this.articles = new ArticlesClient(this);
		this.aiLog = new AiLogClient(this);
	}

	version(): Promise<string> {
		return this.get('status/version').then((r) => r.text());
	}

	stats(): Promise<WnStats> {
		return this.getJson('status/stats');
	}

	getClientStats(): ClientStats {
		return {
			languagesCache: this.languages.getStats()
		}
	}

	startIngestion(sourceId: number): Promise<Response> {
		return this.post(`queues/ingest/start/${sourceId}`);
	}

}

export const WnRestClientContext = createContext(new WnRestClient());
