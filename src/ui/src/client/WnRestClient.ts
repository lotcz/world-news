import {createContext} from "react";
import conf from "../config/conf.json";
import {LookupClient, RestClientWithOAuth} from "zavadil-ts-common";
import {Language} from "../types/Language";
import {ClientStats, WnStats} from "../types/Stats";
import {EnumerationsClient} from "./EnumerationsClient";
import {ArticlesClient} from "./ArticlesClient";
import {AiLogClient} from "./AiLogClient";
import {TopicsClient} from "./TopicsClient";
import {RealmsClient} from "./RealmsClient";
import {ImagesClient} from "./ImagesClient";
import {Website} from "../types/Website";
import {BannersClient} from "./BannersClient";
import {QueuesClient} from "./QueuesClient";
import {CountriesClient} from "./CountriesClient";
import {ArticleSourcesClient} from "./ArticleSourcesClient";

export class WnRestClient extends RestClientWithOAuth {

	public enumerations: EnumerationsClient;

	public queues: QueuesClient;

	public languages: LookupClient<Language>;

	public realms: RealmsClient;

	public articleSources: ArticleSourcesClient;

	public topics: TopicsClient;

	public articles: ArticlesClient;

	public aiLog: AiLogClient;

	public images: ImagesClient;

	public websites: LookupClient<Website>;

	public banners: BannersClient;

	public countries: CountriesClient;

	constructor() {
		super(conf.API_URL);

		this.enumerations = new EnumerationsClient(this);
		this.queues = new QueuesClient(this);
		this.languages = new LookupClient<Language>(this, 'languages');
		this.realms = new RealmsClient(this);
		this.articleSources = new ArticleSourcesClient(this);
		this.topics = new TopicsClient(this);
		this.articles = new ArticlesClient(this);
		this.aiLog = new AiLogClient(this);
		this.images = new ImagesClient(this);
		this.websites = new LookupClient<Website>(this, 'websites');
		this.banners = new BannersClient(this);
		this.countries = new CountriesClient(this);
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

}

export const WnRestClientContext = createContext(new WnRestClient());
