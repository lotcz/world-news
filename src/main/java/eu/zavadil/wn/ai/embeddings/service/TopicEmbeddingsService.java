package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.cache.EmbeddingsCache;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.repository.TopicEmbeddingsRepository;
import eu.zavadil.wn.data.topic.TopicBase;
import eu.zavadil.wn.data.topic.TopicStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TopicEmbeddingsService extends EmbeddingsServiceBase<TopicBase> {

	@Autowired
	TopicStubRepository topicRepository;

	@Autowired
	public TopicEmbeddingsService(
		AiEmbeddingsEngine aiEngine,
		EmbeddingsCache embeddingsCache,
		TopicEmbeddingsRepository topicEmbeddingsRepository
	) {
		super(aiEngine, embeddingsCache, topicEmbeddingsRepository);
	}

	public Embedding updateEmbedding(TopicBase topic) {
		return super.updateEmbedding(topic.getId(), topic.getSummary());
	}

	@Override
	public TopicBase loadEntity(int id) {
		return this.topicRepository.findById(id).orElse(null);
	}

}
