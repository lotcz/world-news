package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.repository.ArticleEmbeddingsRepository;
import eu.zavadil.wn.data.article.Article;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticleEmbeddingsService extends EmbeddingsServiceBase {

	@Autowired
	public ArticleEmbeddingsService(
		AiEmbeddingsEngine aiEngine,
		ArticleEmbeddingsRepository articleEmbeddingsRepository
	) {
		super(aiEngine, articleEmbeddingsRepository);
	}

	public Embedding updateEmbedding(Article article) {
		return super.updateEmbedding(article.getId(), article.getSummary());
	}

}
