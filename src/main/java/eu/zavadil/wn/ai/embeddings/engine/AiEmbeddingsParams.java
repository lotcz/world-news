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

	private String text;

}
