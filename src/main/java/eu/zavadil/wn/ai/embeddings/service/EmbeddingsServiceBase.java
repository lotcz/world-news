package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.cache.EmbeddingsCache;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsResponse;
import eu.zavadil.wn.ai.embeddings.repository.EmbeddingRepositoryBase;

import java.util.List;

public abstract class EmbeddingsServiceBase<T extends EntityBase> {

	private final AiEmbeddingsEngine aiEngine;

	private final EmbeddingsCache embeddingsCache;

	private final EmbeddingRepositoryBase embeddingRepository;

	private Embedding createEmbedding(AiEmbeddingsParams params) {
		AiEmbeddingsResponse response = this.aiEngine.getEmbedding(params);
		return response.getResult();
	}

	private Embedding createEmbedding(String text) {
		return this.createEmbedding(
			AiEmbeddingsParams
				.builder()
				.text(text)
				.build()
		);
	}

	public EmbeddingsServiceBase(
		AiEmbeddingsEngine aiEngine,
		EmbeddingsCache embeddingsCache,
		EmbeddingRepositoryBase embeddingRepository
	) {
		this.aiEngine = aiEngine;
		this.embeddingsCache = embeddingsCache;
		this.embeddingRepository = embeddingRepository;
	}

	public abstract Embedding updateEmbedding(T entity);

	public abstract T loadEntity(int id);

	public Embedding updateEmbedding(int entityId, String text) {
		if (StringUtils.isBlank(text)) {
			this.embeddingRepository.deleteEmbedding(entityId);
			return null;
		}
		Embedding cached = this.embeddingsCache.loadEmbedding(text);
		if (cached == null) {
			cached = this.createEmbedding(text);
			this.embeddingsCache.updateEmbedding(text, cached);
		}
		this.embeddingRepository.updateEmbedding(entityId, cached);
		return cached;
	}

	public Embedding loadEmbedding(int entityId) {
		return this.embeddingRepository.loadEmbedding(entityId);
	}

	public Embedding obtainEmbedding(int entityId) {
		Embedding embedding = this.loadEmbedding(entityId);
		if (embedding != null) return embedding;
		T entity = this.loadEntity(entityId);
		return this.updateEmbedding(entity);
	}

	public List<EmbeddingDistance> searchSimilar(Embedding embedding, int limit, float maxDistance) {
		return this.embeddingRepository.searchSimilar(embedding, limit, maxDistance);
	}

	public List<EmbeddingDistance> searchSimilar(Embedding embedding, int limit) {
		return this.embeddingRepository.searchSimilar(embedding, limit);
	}
}
