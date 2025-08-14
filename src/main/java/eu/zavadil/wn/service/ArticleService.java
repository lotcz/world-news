package eu.zavadil.wn.service;

import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.article.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticleService {

	@Autowired
	ArticleRepository articleRepository;

	public Article save(Article article) {
		return this.articleRepository.save(article);
	}

	public Article loadByOriginalUrl(String originalUrl) {
		return this.articleRepository.findFirstByOriginalUrl(originalUrl).orElse(null);
	}


}
