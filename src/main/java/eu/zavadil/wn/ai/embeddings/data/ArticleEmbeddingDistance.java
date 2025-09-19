package eu.zavadil.wn.ai.embeddings.data;

import eu.zavadil.wn.data.article.Article;

public class ArticleEmbeddingDistance extends EntityEmbeddingDistance<Article> {

	public ArticleEmbeddingDistance(EmbeddingDistance embeddingDistance, Article entity) {
		super(embeddingDistance, entity);
	}
}
