package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.embeddings.data.Embedding;
import eu.zavadil.wn.ai.embeddings.data.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.data.TopicEmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.service.ArticleEmbeddingsService;
import eu.zavadil.wn.ai.embeddings.service.RealmEmbeddingsService;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.article.ArticleRepository;
import eu.zavadil.wn.data.topic.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class TopicService {

	@Autowired
	TopicRepository topicRepository;

	@Autowired
	ArticleRepository articleRepository;

	@Autowired
	TopicStubRepository topicStubRepository;

	@Autowired
	TopicEmbeddingsService topicEmbeddingsService;

	@Autowired
	ArticleEmbeddingsService articleEmbeddingsService;

	@Autowired
	RealmEmbeddingsService realmEmbeddingsService;

	private void onTopicSaved(TopicBase topic) {
		this.topicEmbeddingsService.updateEmbedding(topic);
		this.articleRepository.markInternalArticles(topic.getId(), topic.getLastUpdatedOn());
	}

	@Transactional
	public Topic save(Topic topic) {
		Topic saved = this.topicRepository.save(topic);
		this.onTopicSaved(saved);
		return saved;
	}

	@Transactional
	public TopicStub save(TopicStub topic) {
		TopicStub saved = this.topicStubRepository.save(topic);
		this.onTopicSaved(saved);
		return saved;
	}

	public Page<Topic> search(@Param("search") String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.topicRepository.findAll(pr)
			: this.topicRepository.search(search, pr);
	}

	public TopicStub loadById(int id) {
		return this.topicStubRepository.findById(id).orElse(null);
	}

	public TopicStub requireById(int id) {
		return this.topicStubRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Topic Stub", id));
	}

	public void deleteById(int id) {
		TopicStub topic = this.requireById(id);
		if (topic.getArticleCountInternal() > 0) {
			throw new BadRequestException("Cannot delete topic with internal articles! Unpublish instead.");
		}
		this.topicRepository.deleteById(id);
	}

	public Page<Topic> loadByRealm(int realmId, PageRequest pr) {
		return this.topicRepository.findAllByRealmId(realmId, pr);
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

	public Page<Topic> loadImageSupplyQueue(int size) {
		return this.topicRepository.loadImageSupplyQueue(size);
	}
}

