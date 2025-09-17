import {EntityWithName} from "zavadil-ts-common";

export type Realm = EntityWithName & {
	parentId?: number | null;
	summary?: string;
	topicCount: number;
}

export type RealmTree = {
	realm: Realm | null;
	children: Array<RealmTree>;
	totalTopicCount?: number;
}
