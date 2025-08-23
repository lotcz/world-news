import {createContext} from "react";
import conf from "../config/conf.json";
import {EntityClientWithStub, LookupClient, RestClientWithOAuth} from "zavadil-ts-common";
import {Language} from "../types/Language";
import {ClientStats, WnStats} from "../types/Stats";
import {Realm} from "../types/Realm";
import {ArticleSource} from "../types/ArticleSource";
import {Topic, TopicStub} from "../types/Topic";
import {EnumerationsClient} from "./EnumerationsClient";
import {ArticlesClient} from "./ArticlesClient";
import {AiLogClient} from "./AiLogClient";

export class WnRestClient extends RestClientWithOAuth {

	public enumerations: EnumerationsClient;

	public languages: LookupClient<Language>;

	public realms: LookupClient<Realm>;

	public articleSources: LookupClient<ArticleSource>;

	public topics: EntityClientWithStub<Topic, TopicStub>;

	public articles: ArticlesClient;

	public aiLog: AiLogClient;

	constructor() {
		super(conf.API_URL);

		this.enumerations = new EnumerationsClient(this);
		this.languages = new LookupClient<Language>(this, 'languages');
		this.realms = new LookupClient<Realm>(this, 'realms');
		this.articleSources = new LookupClient<ArticleSource>(this, 'article-sources');
		this.topics = new EntityClientWithStub<Topic, TopicStub>(this, 'topics');
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
