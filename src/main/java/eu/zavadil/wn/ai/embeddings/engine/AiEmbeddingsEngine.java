package eu.zavadil.wn.ai.embeddings.engine;

public interface AiEmbeddingsEngine {

	AiEmbeddingsResponse getEmbedding(AiEmbeddingsParams params);

}
