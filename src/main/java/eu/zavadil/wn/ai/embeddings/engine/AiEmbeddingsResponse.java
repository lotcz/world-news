package eu.zavadil.wn.ai.embeddings.engine;

import eu.zavadil.wn.ai.embeddings.Embedding;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiEmbeddingsResponse {

	private Embedding result = new Embedding();

}
