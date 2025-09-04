package eu.zavadil.wn.service;

import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.TopicEmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.service.ArticleEmbeddingsService;
import eu.zavadil.wn.ai.embeddings.service.RealmEmbeddingsService;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicRepository;
import eu.zavadil.wn.data.topic.TopicStub;
import eu.zavadil.wn.data.topic.TopicStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

	@Autowired
	ArticleEmbeddingsService articleEmbeddingsService;

	@Autowired
	RealmEmbeddingsService realmEmbeddingsService;
	
	@Transactional
	public Topic save(Topic topic) {
		Topic saved = this.topicRepository.save(topic);
		this.topicEmbeddingsService.updateEmbedding(saved);
		return saved;
	}

	@Transactional
	public TopicStub save(TopicStub topic) {
		TopicStub saved = this.topicStubRepository.save(topic);
		this.topicEmbeddingsService.updateEmbedding(saved);
		return saved;
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

	public List<TopicEmbeddingDistance> findSimilar(Embedding embedding, int limit, Float maxDistance) {
		List<EmbeddingDistance> similar = (maxDistance == null) ? this.topicEmbeddingsService.searchSimilar(embedding, limit)
			: this.topicEmbeddingsService.searchSimilar(embedding, limit, maxDistance);
		return similar.stream().map(
			(ed) -> new TopicEmbeddingDistance(ed, this.topicRepository.findById(ed.getEntityId()).orElse(null))
		).toList();
	}

	public List<TopicEmbeddingDistance> findSimilar(Embedding embedding, int limit) {
		return this.findSimilar(embedding, limit, null);
	}

	public List<TopicEmbeddingDistance> findSimilar(int topicId, int limit) {
		return this.findSimilar(this.topicEmbeddingsService.obtainEmbedding(topicId), limit);
	}

	public List<TopicEmbeddingDistance> findSimilarToArticle(int articleId, int limit) {
		Embedding embedding = this.articleEmbeddingsService.obtainEmbedding(articleId);
		return this.findSimilar(embedding, limit);
	}

	public List<TopicEmbeddingDistance> findSimilarToRealm(int realmId, int limit) {
		Embedding embedding = this.realmEmbeddingsService.obtainEmbedding(realmId);
		return this.findSimilar(embedding, limit);
	}

	public Topic findMostSimilar(Embedding embedding) {
		List<TopicEmbeddingDistance> similar = this.findSimilar(embedding, 1, 0.26F);
		if (similar.isEmpty()) return null;
		return similar.get(0).getEntity();
	}

	public Page<Topic> loadTopicsForCompilation() {
		return this.topicRepository.findAllByProcessingStateAndArticleCountExternalGreaterThan(
			ProcessingState.Waiting,
			1,
			PageRequest.of(0, 10)
		);
	}

}
