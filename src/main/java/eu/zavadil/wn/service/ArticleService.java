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
import eu.zavadil.wn.data.article.*;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.data.topic.TopicStubRepository;
import eu.zavadil.wn.data.website.Website;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
	TopicStubRepository topicStubRepository;

	@Autowired
	RealmService realmService;

	@Autowired
	ArticleSourceService articleSourceService;

	// LOAD AND SEARCH

	public Page<Article> search(String search, boolean onlyPublished, boolean onlyInternal, PageRequest pr) {
		if (StringUtils.isBlank(search)) {
			if (onlyPublished) {
				return onlyInternal ? this.articleRepository.loadPublishedInternal(pr)
					: this.articleRepository.loadPublished(pr);
			} else {
				return onlyInternal ? this.articleRepository.loadInternal(pr)
					: this.articleRepository.findAll(pr);
			}
		} else {
			if (onlyPublished) {
				return onlyInternal ? this.articleRepository.searchPublishedInternal(search, pr)
					: this.articleRepository.searchPublished(search, pr);
			} else {
				return onlyInternal ? this.articleRepository.searchInternal(search, pr)
					: this.articleRepository.search(search, pr);
			}
		}
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

	public Article loadByUid(int sourceId, String uid) {
		return this.articleRepository.findFirstBySourceIdAndUid(sourceId, uid).orElse(null);
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

	public Page<Article> loadApprovalQueue(PageRequest pr) {
		return this.articleRepository.loadApprovalQueue(pr);
	}

	public int loadApprovalQueueSize() {
		return this.articleRepository.loadApprovalQueueSize();
	}

	// SAVE

	@Transactional
	public Article save(Article article) {
		Article saved = this.articleRepository.save(article);
		this.articleEmbeddingsService.updateEmbedding(saved);
		if (article.getTopic() != null && article.getMainImage() != null) {
			this.topicStubRepository.changeImageIfEmpty(article.getTopic().getId(), article.getMainImage().getId(), article.isMainImageIsIllustrative());
		}
		return saved;
	}

	@Transactional
	public ArticleStub save(ArticleStub article) {
		ArticleStub saved = this.articleStubRepository.save(article);
		this.articleEmbeddingsService.updateEmbedding(saved);
		if (article.getTopicId() != null && article.getMainImageId() != null) {
			this.topicStubRepository.changeImageIfEmpty(article.getTopicId(), article.getMainImageId(), article.isMainImageIsIllustrative());
		}
		return saved;
	}

	// UPDATE

	public Embedding updateEmbedding(Article article) {
		return this.articleEmbeddingsService.updateEmbedding(article);
	}

	public void moveToTopic(int articleId, int topicId) {
		this.articleStubRepository.moveToTopic(articleId, topicId);
	}

	@Transactional
	public void approveForPublication(int articleId) {
		ArticleStub article = this.requireStubById(articleId);
		if (article.getPublishDate() == null) {
			article.setPublishDate(Instant.now());
		}
		article.setLocked(true);
		this.articleStubRepository.save(article);
	}

	@Transactional
	public void rejectForPublication(int articleId) {
		ArticleStub article = this.requireStubById(articleId);
		article.setPublishDate(null);
		article.setLocked(true);
		this.articleStubRepository.save(article);
	}

	@Transactional
	public void changeArticleType(int articleId, ArticleType articleType) {
		this.articleStubRepository.changeArticleType(articleId, articleType);
	}

	@Transactional
	public void changeImage(int articleId, Integer imageId, boolean illustrative) {
		this.articleStubRepository.changeImage(articleId, imageId, illustrative);
		if (imageId != null) {
			ArticleStub article = this.loadStubById(articleId);
			if (article.getTopicId() != null) {
				this.topicStubRepository.changeImageIfEmpty(article.getTopicId(), imageId, illustrative);
			}
		}
	}

	// DELETE

	public void deleteById(int id) {
		Article article = this.requireById(id);
		if (article.isInternal()) {
			throw new BadRequestException("Internal articles cannot be deleted! Unpublish them instead.");
		}
		this.articleRepository.deleteById(id);
	}

}
