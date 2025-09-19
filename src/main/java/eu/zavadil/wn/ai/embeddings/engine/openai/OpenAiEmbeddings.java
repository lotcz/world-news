package eu.zavadil.wn.ai.embeddings.engine.openai;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.CreateEmbeddingResponse;
import com.openai.models.embeddings.EmbeddingCreateParams;
import eu.zavadil.java.caching.Lazy;
import eu.zavadil.wn.ai.embeddings.data.Embedding;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class OpenAiEmbeddings implements AiEmbeddingsEngine {

	@Value("${chatgpt.apikey}")
	String apiKey;

	private final Lazy<OpenAIClient> openAIClient;

	public OpenAiEmbeddings() {
		this.openAIClient = new Lazy<>(
			() -> OpenAIOkHttpClient
				.builder()
				.apiKey(this.apiKey)
				.build()
		);
	}

	@Override
	public AiEmbeddingsResponse getEmbedding(AiEmbeddingsParams params) {
		EmbeddingCreateParams request = EmbeddingCreateParams
			.builder()
			.model(params.getModel())
			.input(params.getText())
			.build();

		long start = System.nanoTime();

		CreateEmbeddingResponse response = this.openAIClient
			.get()
			.embeddings()
			.create(request);

		long elapsed = System.nanoTime() - start;

		Embedding embedding = new Embedding(response.data().get(0).embedding());

		return AiEmbeddingsResponse
			.builder()
			.result(embedding)
			.inputTokens(response.usage().promptTokens())
			.processingTimeNs(elapsed)
			.build();
	}

}
