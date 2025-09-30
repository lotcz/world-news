import {EntityWithName} from "zavadil-ts-common";
import {Language} from "./Language";

export type WebsiteBase = EntityWithName & {
	name: string;
	url: string;
	description?: string | null;
	secretImportToken?: string | null;
	useSsl: boolean;
	importLastStarted?: Date | null;
	importLastHeartbeat?: Date | null;
	importLastArticleUpdatedOn?: Date | null;
}

export type WebsiteStub = WebsiteBase & {
	languageId: number;
}

export type Website = WebsiteBase & {
	language: Language;
}
