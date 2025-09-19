import {EntityWithName} from "zavadil-ts-common";
import {Language} from "./Language";
import {Realm} from "./Realm";

export type ArticleSourceBase = EntityWithName & {
	processingState?: string;
	url?: string;
	lastImported?: Date | null;
	importType: string;
	articleCount: number;
	limitToElement?: string | null;
	excludeElements?: string | null;
	filterOutText?: string | null;
}

export type ArticleSourceStub = ArticleSourceBase & {
	languageId?: number | null;
}

export type ArticleSource = ArticleSourceBase & {
	language?: Language | null;
	realms: Array<Realm>;
}
