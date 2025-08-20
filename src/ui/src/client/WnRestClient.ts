import {createContext} from "react";
import conf from "../config/conf.json";
import {EntityClientWithStub, LookupClient, RestClientWithOAuth} from "zavadil-ts-common";
import {Language} from "../types/Language";
import {Article, ArticleStub} from "../types/Article";
import {ClientStats, WnStats} from "../types/Stats";
import {Realm} from "../types/Realm";
import {ArticleSource} from "../types/ArticleSource";

export class WnRestClient extends RestClientWithOAuth {

	public languages: LookupClient<Language>;

	public realms: LookupClient<Realm>;

	public articleSources: LookupClient<ArticleSource>;

	public articles: EntityClientWithStub<Article, ArticleStub>;

	constructor() {
		super(conf.API_URL);

		this.languages = new LookupClient<Language>(this, 'languages');
		this.realms = new LookupClient<Realm>(this, 'realms');
		this.articleSources = new LookupClient<ArticleSource>(this, 'article-sources');
		this.articles = new EntityClientWithStub<Article, ArticleStub>(this, 'articles');
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
