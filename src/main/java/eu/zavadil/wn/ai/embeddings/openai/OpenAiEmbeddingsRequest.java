package eu.zavadil.wn.ai.embeddings.openai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OpenAiEmbeddingsRequest {

	private String input;

	private String model;

}
