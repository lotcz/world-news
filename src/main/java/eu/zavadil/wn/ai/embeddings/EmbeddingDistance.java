package eu.zavadil.wn.ai.embeddings;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmbeddingDistance {

	private final float distance;

	private final int entityId;

}
