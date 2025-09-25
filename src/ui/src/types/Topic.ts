import {EntityWithName} from "zavadil-ts-common";
import {Realm} from "./Realm";
import {Image} from "./Image";

export type TopicBase = EntityWithName & {
	isLocked: boolean;
	summary?: string;
	processingState?: string | null;
	articleCount: number;
	articleCountInternal: number;
	articleCountExternal: number;
	mainImageIsIllustrative: boolean;
	mainImageIsAiGenerated: boolean;
}

export type TopicStub = TopicBase & {
	realmId?: number | null;
	mainImageId?: number | null;
}

export type Topic = TopicBase & {
	realm?: Realm;
	mainImage?: Image;
}
