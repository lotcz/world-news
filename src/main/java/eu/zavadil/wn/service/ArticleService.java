package eu.zavadil.wn.service;

import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.article.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleService {

	@Autowired
	ArticleRepository articleRepository;

	@Transactional
	public Article save(Article article) {
		return this.articleRepository.save(article);
	}

	public Article loadByOriginalUrl(String originalUrl) {
		return this.articleRepository.findFirstByOriginalUrl(originalUrl).orElse(null);
	}

	public List<Article> loadNotReady() {
		return this.articleRepository
			.findAllByProcessingStateOrderByLastUpdatedOnAsc(
				ProcessingState.NotReady,
				PageRequest.of(0, 10)
			)
			.getContent();
	}

}
