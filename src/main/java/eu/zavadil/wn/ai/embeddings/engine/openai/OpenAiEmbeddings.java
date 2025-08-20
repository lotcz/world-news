package eu.zavadil.wn.ai.embeddings.engine.openai;

import eu.zavadil.java.spring.common.client.HttpApiClientBase;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

@Service
public class OpenAiEmbeddings extends HttpApiClientBase implements AiEmbeddingsEngine {

	@Value("${chatgpt.apikey}")
	String apiKey;

	/**
	 * Don't change this without resetting database! Different models are not compatible for search.
	 */
	private String model = "text-embedding-3-small";

	public OpenAiEmbeddings() {
		super("https://api.openai.com/v1/embeddings");
	}

	@Override
	public HttpHeaders getHttpHeaders(String path) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");
		headers.add("Authorization", String.format("Bearer %s", this.apiKey));
		return headers;
	}

	@Override
	public AiEmbeddingsResponse getEmbedding(AiEmbeddingsParams params) {
		OpenAiEmbeddingsRequest request = OpenAiEmbeddingsRequest
			.builder()
			.model(this.model)
			.input(params.getText())
			.build();

		OpenAiEmbeddingsResponse response = this.exchange(HttpMethod.POST, "", request, OpenAiEmbeddingsResponse.class);
		Embedding embedding = response.getData().get(0).getEmbedding();

		return AiEmbeddingsResponse
			.builder()
			.result(embedding)
			.build();
	}

}
