package eu.zavadil.wn.ai.embeddings.engine.chatgpt;

import eu.zavadil.java.spring.common.client.HttpApiClientBase;
import eu.zavadil.wn.ai.embeddings.data.Embedding;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

@Service
public class ChatGptEmbeddings extends HttpApiClientBase implements AiEmbeddingsEngine {

	@Value("${chatgpt.apikey}")
	String apiKey;

	public ChatGptEmbeddings() {
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
		ChatGptEmbeddingsRequest request = ChatGptEmbeddingsRequest
			.builder()
			.model(params.getModel())
			.input(params.getText())
			.build();

		ChatGptEmbeddingsResponse response = this.exchange(HttpMethod.POST, "", request, ChatGptEmbeddingsResponse.class);
		Embedding embedding = response.getData().get(0).getEmbedding();

		return AiEmbeddingsResponse
			.builder()
			.result(embedding)
			.build();
	}

}
