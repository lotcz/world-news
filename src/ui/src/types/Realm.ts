import {EntityWithName} from "zavadil-ts-common";

export type Realm = EntityWithName & {
	isHidden: boolean;
	parentId?: number | null;
	summary?: string;
	topicCount: number;
	publishDate?: Date | null;
}

export type RealmTree = {
	realm: Realm | null;
	children: Array<RealmTree>;
	totalTopicCount?: number;
}
