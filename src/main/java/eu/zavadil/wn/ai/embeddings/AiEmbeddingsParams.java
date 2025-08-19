package eu.zavadil.wn.ai.embeddings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiEmbeddingsParams {

	private String text;

	@Builder.Default
	private String model = "text-embedding-3-small";

}
