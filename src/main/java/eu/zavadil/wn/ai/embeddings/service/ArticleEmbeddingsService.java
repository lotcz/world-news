package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.cache.EmbeddingsCache;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.repository.ArticleEmbeddingsRepository;
import eu.zavadil.wn.data.article.ArticleBase;
import eu.zavadil.wn.data.article.ArticleStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticleEmbeddingsService extends EmbeddingsServiceBase<ArticleBase> {

	@Autowired
	ArticleStubRepository articleRepository;

	@Autowired
	public ArticleEmbeddingsService(
		AiEmbeddingsEngine aiEngine,
		EmbeddingsCache embeddingsCache,
		ArticleEmbeddingsRepository articleEmbeddingsRepository
	) {
		super(aiEngine, embeddingsCache, articleEmbeddingsRepository);
	}

	public Embedding updateEmbedding(ArticleBase article) {
		return super.updateEmbedding(article.getId(), article.getSummary());
	}

	@Override
	public ArticleBase loadEntity(int id) {
		return this.articleRepository.findById(id).orElse(null);
	}

}
