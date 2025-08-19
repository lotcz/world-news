package eu.zavadil.wn.ai.embeddings;

public interface AiEmbeddingsEngine {

	AiEmbeddingsResponse getEmbedding(AiEmbeddingsParams params);

}
