import {EntityWithName} from "zavadil-ts-common";
import {Realm} from "./Realm";
import {Image} from "./Image";
import {Country} from "./Country";

export type TopicBase = EntityWithName & {
	isLocked: boolean;
	articleType: string;
	publishDate?: Date | null;
	summary?: string;
	processingState?: string | null;
	articleCount: number;
	articleCountInternal: number;
	articleCountExternal: number;
	mainImageIsIllustrative: boolean;
	externalArticlesSourceCount: number;
	externalArticlesUnusedCount: number;
}

export type TopicStub = TopicBase & {
	realmId?: number | null;
	mainImageId?: number | null;
	countryId?: number | null;
}

export type Topic = TopicBase & {
	realm?: Realm;
	mainImage?: Image;
	country?: Country;
}
