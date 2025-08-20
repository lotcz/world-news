package eu.zavadil.wn.ai.embeddings.engine.openai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OpenAiEmbeddingsRequest {

	private String input;

	@Builder.Default
	private String model = "text-embedding-3-small";

}
