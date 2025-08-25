import {EntityWithName} from "zavadil-ts-common";
import {Realm} from "./Realm";
import {Language} from "./Language";

export type TopicBase = EntityWithName & {
	summary?: string;
	processingState?: string | null;
	articleCount: number;
}

export type TopicStub = TopicBase & {
	realmId?: number | null;
	languageId?: number | null;
}

export type Topic = TopicBase & {
	realm: Realm;
	language: Language;
}
