package eu.zavadil.wn.worker.annotate;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.article.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AnnotateArticleQueue extends PagedSmartQueue<Article> {

	@Autowired
	ArticleRepository articleRepository;

	@Override
	public Page<Article> loadRemaining() {
		return this.articleRepository.loadAnnotationQueue(
			PageRequest.of(0, 10, Sort.by("lastUpdatedOn"))
		);
	}

}
