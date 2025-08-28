package eu.zavadil.wn.ai.embeddings;

import lombok.Getter;

public class EntityEmbeddingDistance<T> extends EmbeddingDistance {

	public EntityEmbeddingDistance(EmbeddingDistance embeddingDistance, T entity) {
		super(embeddingDistance.getDistance(), embeddingDistance.getEntityId());
		this.entity = entity;
	}

	@Getter
	private final T entity;

}
