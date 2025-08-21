package eu.zavadil.wn.service;

import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicRepository;
import eu.zavadil.wn.data.topic.TopicStub;
import eu.zavadil.wn.data.topic.TopicStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TopicService {

	@Autowired
	TopicRepository topicRepository;

	@Autowired
	TopicStubRepository topicStubRepository;

	@Autowired
	TopicEmbeddingsService topicEmbeddingsService;

	private Embedding updateEmbedding(Topic topic) {
		return this.topicEmbeddingsService.updateEmbedding(topic.getId(), topic.getSummary());
	}

	private Embedding updateEmbedding(TopicStub topic) {
		return this.topicEmbeddingsService.updateEmbedding(topic.getId(), topic.getSummary());
	}

	@Transactional
	public Topic save(Topic topic) {
		this.topicRepository.save(topic);
		this.updateEmbedding(topic);
		return topic;
	}

	@Transactional
	public TopicStub save(TopicStub topic) {
		this.topicStubRepository.save(topic);
		this.updateEmbedding(topic);
		return topic;
	}

	public Page<Topic> search(@Param("search") String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.topicRepository.findAll(pr)
			: this.topicRepository.search(search, pr);
	}

	public TopicStub loadById(int id) {
		return this.topicStubRepository.findById(id).orElse(null);
	}

	public void deleteById(int id) {
		this.topicRepository.deleteById(id);
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

	public Page<Topic> loadTopicsForCompilation() {
		return this.topicRepository.findAllByProcessingStateAndArticleCountGreaterThan(
			ProcessingState.Waiting,
			1,
			PageRequest.of(0, 10, Sort.by(Sort.Order.desc("lastUpdatedOn")))
		);
	}

}
