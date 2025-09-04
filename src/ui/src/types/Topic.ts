import {EntityWithName} from "zavadil-ts-common";
import {Realm} from "./Realm";

export type TopicBase = EntityWithName & {
	summary?: string;
	processingState?: string | null;
	articleCount: number;
	articleCountExternal: number;
}

export type TopicStub = TopicBase & {
	realmId?: number | null;
}

export type Topic = TopicBase & {
	realm: Realm;
}
