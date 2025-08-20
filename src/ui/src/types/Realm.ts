import {EntityWithName} from "zavadil-ts-common";
import {ArticleSource} from "./ArticleSource";

export type Realm = EntityWithName & {
	summary?: string;
	approved: boolean;
	sources: Array<ArticleSource>;
}
