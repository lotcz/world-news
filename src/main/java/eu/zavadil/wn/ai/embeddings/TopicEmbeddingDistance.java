package eu.zavadil.wn.ai.embeddings;

import eu.zavadil.wn.data.topic.Topic;

public class TopicEmbeddingDistance extends EntityEmbeddingDistance<Topic> {

	public TopicEmbeddingDistance(EmbeddingDistance embeddingDistance, Topic entity) {
		super(embeddingDistance, entity);
	}
}
