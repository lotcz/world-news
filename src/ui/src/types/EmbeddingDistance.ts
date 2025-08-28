import {Topic} from "./Topic";
import {Article} from "./Article";

export type EmbeddingDistance = {
	distance: number;
	entityId: number;
}

export type ArticleEmbeddingDistance = EmbeddingDistance & {
	entity: Article;
}

export type TopicEmbeddingDistance = EmbeddingDistance & {
	entity: Topic;
}
