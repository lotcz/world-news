package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.embeddings.data.ArticleEmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.data.Embedding;
import eu.zavadil.wn.ai.embeddings.data.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.service.ArticleEmbeddingsService;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.article.ArticleRepository;
import eu.zavadil.wn.data.article.ArticleStub;
import eu.zavadil.wn.data.article.ArticleStubRepository;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.data.website.Website;
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
	TopicEmbeddingsService topicEmbeddingsService;

	@Autowired
	RealmService realmService;

	@Autowired
	ArticleSourceService articleSourceService;

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

	public Page<Article> loadInternalByTopicId(int topicId, PageRequest pr) {
		return this.articleRepository.loadInternalByTopicId(topicId, pr);
	}

	public Page<Article> loadExternalByTopicId(int topicId, PageRequest pr) {
		return this.articleRepository.loadExternalByTopicId(topicId, pr);
	}

	public Page<Article> loadBySourceId(int sourceId, PageRequest pr) {
		return this.articleRepository.findAllBySourceId(sourceId, pr);
	}

	public Page<Article> loadByTagId(int tagId, PageRequest pr) {
		return this.articleRepository.loadByTagId(tagId, pr);
	}

	public ArticleStub loadStubById(int id) {
		return this.articleStubRepository.findById(id).orElse(null);
	}

	public ArticleStub requireStubById(int id) {
		return this.articleStubRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Article Stub", id));
	}

	public Article loadById(int id) {
		return this.articleRepository.findById(id).orElse(null);
	}

	public Article requireById(int id) {
		return this.articleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Article", id));
	}

	public void deleteById(int id) {
		Article article = this.requireById(id);
		if (article.isInternal()) {
			throw new BadRequestException("Internal articles cannot be deleted! Unpublish them instead.");
		}
		this.articleRepository.deleteById(id);
	}

	public Article loadByUid(int sourceId, String uid) {
		return this.articleRepository.findFirstBySourceIdAndUid(sourceId, uid).orElse(null);
	}

	public Embedding updateEmbedding(Article article) {
		return this.articleEmbeddingsService.updateEmbedding(article);
	}

	public List<ArticleEmbeddingDistance> findSimilar(Embedding embedding, int limit, Float maxDistance) {
		List<EmbeddingDistance> similar = maxDistance == null ? this.articleEmbeddingsService.searchSimilar(embedding, limit)
			: this.articleEmbeddingsService.searchSimilar(embedding, limit, maxDistance);
		return similar.stream().map(
			(ed) -> new ArticleEmbeddingDistance(ed, this.articleRepository.findById(ed.getEntityId()).orElse(null))
		).toList();
	}

	public List<ArticleEmbeddingDistance> findSimilar(Embedding embedding, int limit) {
		return this.findSimilar(embedding, limit, null);
	}

	public List<ArticleEmbeddingDistance> findSimilar(int articleId, int limit) {
		return this.findSimilar(this.articleEmbeddingsService.obtainEmbedding(articleId), limit);
	}

	public List<ArticleEmbeddingDistance> findSimilarToTopic(int topicId, int limit) {
		Embedding embedding = this.topicEmbeddingsService.obtainEmbedding(topicId);
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

	public Page<Article> loadArticlesForWebsiteImport(Website website, int size) {
		List<Realm> realms = this.realmService.findAllPublishedForWebsite(website);
		if (realms.isEmpty())
			throw new BadRequestException(String.format("No published realms for website %s", website.getUrl()));
		List<Integer> realmIds = realms.stream().map(Realm::getId).toList();
		ArticleSource internalSource = this.articleSourceService.getInternalArticleSource();
		return this.articleRepository
			.loadArticlesForImport(
				internalSource.getId(),
				realmIds,
				website.getImportLastArticleUpdatedOn(),
				size
			);
	}
}
