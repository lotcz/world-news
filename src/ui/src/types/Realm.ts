import {EntityWithName} from "zavadil-ts-common";
import {ArticleSource} from "./ArticleSource";

export type Realm = EntityWithName & {
	parentId?: number | null;
	summary?: string;
	approved: boolean;
	sources: Array<ArticleSource>;
}

export type RealmTree = {
	realm: Realm | null;
	children: Array<RealmTree>;
	collapsed?: boolean;
}
