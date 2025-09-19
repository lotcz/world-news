package eu.zavadil.wn.ai.embeddings.engine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiEmbeddingsParams {

	/**
	 * Don't change this without resetting database! Different models are not compatible for search.
	 */
	@Builder.Default
	private String model = "text-embedding-3-small";

	private String text;

	public static AiEmbeddingsParams of(String text) {
		return AiEmbeddingsParams
			.builder()
			.text(text)
			.build();
	}

}
