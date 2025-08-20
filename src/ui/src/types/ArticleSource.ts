import {EntityWithName} from "zavadil-ts-common";
import {Language} from "./Language";
import {Realm} from "./Realm";

export type ArticleSourceBase = EntityWithName & {
	url?: string;
	lastImported?: Date | null;
	importType?: string | null;
	filterOut?: string | null;
}

export type ArticleSourceStub = ArticleSourceBase & {
	languageId?: number | null;
}

export type ArticleSource = ArticleSourceBase & {
	language?: Language | null;
	realms: Array<Realm>;
}
