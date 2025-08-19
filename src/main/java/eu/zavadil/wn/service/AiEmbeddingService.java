package eu.zavadil.wn.service;

import eu.zavadil.wn.ai.embeddings.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.AiEmbeddingsResponse;
import eu.zavadil.wn.data.article.Article;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiEmbeddingService {

	private String model = "text-embedding-3-small";

	@Autowired
	AiEmbeddingsEngine aiEngine;

	@Autowired
	EmbeddingStoreService embeddingStoreService;

	public List<Double> createEmbedding(AiEmbeddingsParams params) {
		AiEmbeddingsResponse response = this.aiEngine.getEmbedding(params);
		return response.getResult();
	}

	public List<Double> createEmbedding(String text) {
		return this.createEmbedding(
			AiEmbeddingsParams
				.builder()
				.text(text)
				.model(this.model)
				.build()
		);
	}

	public List<Double> createEmbedding(Article article) {
		String text = String.format("%s\r\n%s", article.getTitle(), article.getBody());
		List<Double> embedding = this.createEmbedding(text);
		this.embeddingStoreService.updateEmbedding(article.getId(), this.model, embedding);
		return embedding;
	}

}
