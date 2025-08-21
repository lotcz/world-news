package eu.zavadil.wn.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
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

import java.util.List;

@Service
public class ArticleService {

	@Autowired
	ArticleRepository articleRepository;

	@Autowired
	ArticleStubRepository articleStubRepository;

	@Autowired
	ArticleEmbeddingsService articleEmbeddingsService;

	@Transactional
	public Article save(Article article) {
		return this.articleRepository.save(article);
	}

	@Transactional
	public ArticleStub save(ArticleStub article) {
		return this.articleStubRepository.save(article);
	}

	public Page<Article> search(@Param("search") String search, PageRequest pr) {
		return this.articleRepository.search(search, pr);
	}

	public ArticleStub loadById(int id) {
		return this.articleStubRepository.findById(id).orElse(null);
	}

	public void deleteById(int id) {
		this.articleRepository.deleteById(id);
	}

	public Article loadByOriginalUrl(String originalUrl) {
		return this.articleRepository.findFirstByOriginalUrl(originalUrl).orElse(null);
	}

	public List<Article> loadArticlesForAnnotationWorker() {
		return this.articleRepository
			.findAllByProcessingStateOrderByLastUpdatedOnAsc(
				ProcessingState.Waiting,
				PageRequest.of(0, 10)
			)
			.getContent();
	}

	public Embedding updateEmbedding(Article article) {
		return this.articleEmbeddingsService.updateEmbedding(article.getId(), article.getSummary());
	}
}
