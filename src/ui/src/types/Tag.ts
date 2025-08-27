import {EntityWithName} from "zavadil-ts-common";

export type TagBase = EntityWithName & {
	articleCount: number;
}

export type TagStub = TagBase & {
	synonymOfId?: number | null;
}

export type Tag = TagBase & {
	synonymOf?: Tag;
}
