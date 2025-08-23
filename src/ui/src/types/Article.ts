import {EntityBase} from "zavadil-ts-common";
import {Language} from "./Language";
import {ArticleSource} from "./ArticleSource";
import {Topic} from "./Topic";

export type ArticleBase = EntityBase & {
	title?: string;
	publishDate?: Date | null;
	originalUrl?: string | null;
	originalUid?: string | null;
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
	language?: Language;
	source?: ArticleSource;
	topic?: Topic;
}
