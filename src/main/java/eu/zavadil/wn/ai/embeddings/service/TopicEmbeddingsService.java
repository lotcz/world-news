package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.repository.TopicEmbeddingsRepository;
import eu.zavadil.wn.data.topic.Topic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TopicEmbeddingsService extends EmbeddingsServiceBase {

	@Autowired
	public TopicEmbeddingsService(
		AiEmbeddingsEngine aiEngine,
		TopicEmbeddingsRepository topicEmbeddingsRepository
	) {
		super(aiEngine, topicEmbeddingsRepository);
	}

	public Embedding updateEmbedding(Topic topic) {
		return super.updateEmbedding(topic.getId(), topic.getSummary());
	}

}
