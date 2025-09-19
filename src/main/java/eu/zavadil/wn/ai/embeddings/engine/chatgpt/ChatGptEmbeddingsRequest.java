package eu.zavadil.wn.ai.embeddings.engine.chatgpt;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatGptEmbeddingsRequest {

	private String input;

	@Builder.Default
	private String model = "text-embedding-3-small";

}
