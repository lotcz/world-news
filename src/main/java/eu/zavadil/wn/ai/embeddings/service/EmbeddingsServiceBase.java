package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.AiLogService;
import eu.zavadil.wn.ai.embeddings.cache.EmbeddingsCache;
import eu.zavadil.wn.ai.embeddings.data.Embedding;
import eu.zavadil.wn.ai.embeddings.data.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsResponse;
import eu.zavadil.wn.ai.embeddings.repository.EmbeddingRepositoryBase;
import eu.zavadil.wn.data.aiLog.EntityType;

import java.util.List;

public abstract class EmbeddingsServiceBase<T extends EntityBase> {

	private final EntityType entityType;

	private final AiEmbeddingsEngine aiEngine;

	private final AiLogService aiLogService;

	private final EmbeddingsCache embeddingsCache;

	private final EmbeddingRepositoryBase embeddingRepository;

	private Embedding createEmbedding(Integer entityId, AiEmbeddingsParams params) {
		AiEmbeddingsResponse response = this.aiEngine.getEmbedding(params);
		this.aiLogService.log(params, response, this.entityType, entityId);
		return response.getResult();
	}

	private Embedding createEmbedding(Integer entityId, String text) {
		return this.createEmbedding(entityId, AiEmbeddingsParams.of(text));
	}

	public EmbeddingsServiceBase(
		EntityType entityType,
		AiEmbeddingsEngine aiEngine,
		AiLogService aiLogService,
		EmbeddingsCache embeddingsCache,
		EmbeddingRepositoryBase embeddingRepository
	) {
		this.entityType = entityType;
		this.aiEngine = aiEngine;
		this.aiLogService = aiLogService;
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
			cached = this.createEmbedding(entityId, text);
			this.embeddingsCache.updateEmbedding(text, cached);
		}
		this.embeddingRepository.updateEmbedding(entityId, cached);
		return cached;
	}

	public Embedding loadEmbedding(int entityId) {
		return this.embeddingRepository.loadEmbedding(entityId);
	}

	public Embedding obtainEmbedding(T entity) {
		Embedding embedding = this.loadEmbedding(entity.getId());
		if (embedding != null) return embedding;
		return this.updateEmbedding(entity);
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
