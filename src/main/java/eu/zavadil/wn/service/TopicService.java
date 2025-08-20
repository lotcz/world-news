package eu.zavadil.wn.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TopicService {

	@Autowired
	TopicRepository topicRepository;

	@Autowired
	TopicEmbeddingsService topicEmbeddingsService;

	private Embedding updateEmbedding(Topic topic) {
		return this.topicEmbeddingsService.updateEmbedding(topic.getId(), topic.getSummary());
	}

	@Transactional
	public Topic save(Topic topic) {
		this.topicRepository.save(topic);
		this.updateEmbedding(topic);
		return topic;
	}

	public Topic findMostSimilar(Embedding embedding) {
		List<Integer> similar = this.topicEmbeddingsService.searchSimilar(embedding, 0.2F, 1);
		if (similar.isEmpty()) return null;
		int topicId = similar.get(0);
		return this.topicRepository.findById(topicId).orElse(null);
	}

	public Topic findMostSimilar(String summary) {
		Embedding embedding = this.topicEmbeddingsService.createEmbedding(summary);
		return this.findMostSimilar(embedding);
	}

}
