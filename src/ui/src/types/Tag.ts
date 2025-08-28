import {EntityWithName} from "zavadil-ts-common";
import {Language} from "./Language";

export type TagBase = EntityWithName & {
	articleCount: number;
}

export type TagStub = TagBase & {
	synonymOfId?: number | null;
	languageId?: number | null;
}

export type Tag = TagBase & {
	synonymOf?: Tag;
	language?: Language;
}
