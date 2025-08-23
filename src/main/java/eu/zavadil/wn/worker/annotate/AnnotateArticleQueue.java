package eu.zavadil.wn.worker.annotate;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class AnnotateArticleQueue extends PagedSmartQueue<Article> {

	@Autowired
	ArticleService articleService;

	@Override
	public Page<Article> loadRemaining() {
		return this.articleService.loadArticlesForAnnotationWorker();
	}

}
