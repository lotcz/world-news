package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsResponse;
import eu.zavadil.wn.ai.embeddings.repository.EmbeddingRepositoryBase;

import java.util.List;

public class EmbeddingsServiceBase {

	private final AiEmbeddingsEngine aiEngine;

	private final EmbeddingRepositoryBase embeddingRepository;

	public EmbeddingsServiceBase(
		AiEmbeddingsEngine aiEngine,
		EmbeddingRepositoryBase embeddingRepository
	) {
		this.aiEngine = aiEngine;
		this.embeddingRepository = embeddingRepository;
	}

	public Embedding createEmbedding(AiEmbeddingsParams params) {
		AiEmbeddingsResponse response = this.aiEngine.getEmbedding(params);
		return response.getResult();
	}

	public Embedding createEmbedding(String text) {
		return this.createEmbedding(
			AiEmbeddingsParams
				.builder()
				.text(text)
				.build()
		);
	}

	public Embedding updateEmbedding(int entityId, String text) {
		Embedding existing = this.embeddingRepository.loadEmbedding(text);
		if (existing != null) return existing;
		Embedding embedding = this.createEmbedding(text);
		this.embeddingRepository.updateEmbedding(entityId, text, embedding);
		return embedding;
	}

	public Embedding loadEmbedding(int entityId) {
		return this.embeddingRepository.loadEmbedding(entityId);
	}

	public List<EmbeddingDistance> searchSimilar(Embedding embedding, float maxDistance, int limit) {
		return this.embeddingRepository.searchSimilar(embedding, maxDistance, limit);
	}
}
