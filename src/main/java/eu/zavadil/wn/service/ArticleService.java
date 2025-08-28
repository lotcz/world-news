package eu.zavadil.wn.service;

import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.embeddings.ArticleEmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.service.ArticleEmbeddingsService;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.article.ArticleRepository;
import eu.zavadil.wn.data.article.ArticleStub;
import eu.zavadil.wn.data.article.ArticleStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class ArticleService {

	@Autowired
	ArticleRepository articleRepository;

	@Autowired
	ArticleStubRepository articleStubRepository;

	@Autowired
	ArticleEmbeddingsService articleEmbeddingsService;

	@Autowired
	TopicService topicService;

	@Transactional
	public Article save(Article article) {
		Article saved = this.articleRepository.save(article);
		this.articleEmbeddingsService.updateEmbedding(saved);
		return saved;
	}

	@Transactional
	public ArticleStub save(ArticleStub article) {
		ArticleStub saved = this.articleStubRepository.save(article);
		this.articleEmbeddingsService.updateEmbedding(saved);
		return saved;
	}

	public Page<Article> search(@Param("search") String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.articleRepository.findAll(pr)
			: this.articleRepository.search(search, pr);
	}

	public List<Article> loadAllByTopicId(int topicId) {
		return this.articleRepository.findAllByTopicId(topicId);
	}

	public Page<Article> loadByTopicId(int topicId, PageRequest pr) {
		return this.articleRepository.findAllByTopicId(topicId, pr);
	}

	public Page<Article> loadBySourceId(int sourceId, PageRequest pr) {
		return this.articleRepository.findAllBySourceId(sourceId, pr);
	}

	public Page<Article> loadByTagId(int tagId, PageRequest pr) {
		return this.articleRepository.loadByTagId(tagId, pr);
	}

	public ArticleStub loadById(int id) {
		return this.articleStubRepository.findById(id).orElse(null);
	}

	public void deleteById(int id) {
		this.articleRepository.deleteById(id);
	}

	public Article loadByOriginalUrlOrUid(String originalUrl, String originalUid) {
		String url = Article.sanitizeUrl(originalUrl);
		String uid = Article.sanitizeUid(originalUid);
		return this.articleRepository.findFirstByOriginalUrl(url).orElseGet(
			() -> StringUtils.isBlank(uid) ? null
				: this.articleRepository.findFirstByOriginalUid(uid).orElse(null)
		);
	}

	public Page<Article> loadArticlesForAnnotationWorker() {
		return this.articleRepository
			.findAllByProcessingStateOrderByLastUpdatedOnAsc(
				ProcessingState.Waiting,
				PageRequest.of(0, 10)
			);
	}

	public Embedding loadEmbedding(int articleId) {
		return this.articleEmbeddingsService.loadEmbedding(articleId);
	}

	public Embedding obtainEmbedding(Article article) {
		return this.articleEmbeddingsService.updateEmbedding(article);
	}

	public List<ArticleEmbeddingDistance> findSimilar(Embedding embedding, float maxDistance, int limit) {
		List<EmbeddingDistance> similar = this.articleEmbeddingsService.searchSimilar(embedding, maxDistance, limit);
		return similar.stream().map(
			(ed) -> new ArticleEmbeddingDistance(ed, this.articleRepository.findById(ed.getEntityId()).orElse(null))
		).toList();
	}

	public List<ArticleEmbeddingDistance> findSimilar(Embedding embedding, int limit) {
		return this.findSimilar(embedding, 1, limit);
	}

	public List<ArticleEmbeddingDistance> findSimilar(int articleId, int limit) {
		return this.findSimilar(this.loadEmbedding(articleId), limit);
	}

	public List<ArticleEmbeddingDistance> findSimilarToTopic(int topicId, int limit) {
		Embedding embedding = this.topicService.loadEmbedding(topicId);
		return this.findSimilar(embedding, limit);
	}

	public Page<Article> loadStuckArticles() {
		Instant maxUpdated = Instant.now().minus(Duration.ofMinutes(10));
		return this.articleRepository
			.findAllByProcessingStateAndLastUpdatedOnLessThanOrderByLastUpdatedOnAsc(
				ProcessingState.Processing,
				maxUpdated,
				PageRequest.of(0, 10)
			);
	}

}
