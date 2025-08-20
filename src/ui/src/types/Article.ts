import {EntityBase} from "zavadil-ts-common";
import {Language} from "./Language";

export type ArticleBase = EntityBase & {
	title?: string | null;
	publishDate?: Date | null;
	originalUrl?: string | null;
	summary?: string | null;
	body?: string | null;
	processingState?: string | null;
}

export type ArticleStub = ArticleBase & {
	topicId?: number | null;
	sourceId?: number | null;
	languageId?: number | null;
}

export type Article = ArticleBase & {
	language?: Language | null;
}
