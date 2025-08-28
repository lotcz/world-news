package eu.zavadil.wn.worker.cleanup.annotating;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Find articles stuck in Processing state and restart them
 */
@Service
@Slf4j
public class AnnotatingCleanupWorker extends SmartQueueProcessorBase<Article> implements AnnotatingCleanupQueueProcessor {

	@Autowired
	ArticleService articleService;

	@Autowired
	public AnnotatingCleanupWorker(AnnotatingCleanupQueue queue) {
		super(queue);
	}

	public void cleanup(Article article) {
		article.setProcessingState(ProcessingState.Waiting);
		this.articleService.save(article);
	}

	@Override
	public void processItem(Article article) {
		try {
			this.cleanup(article);
		} catch (Exception e) {
			log.error("Ingesting cleanup failed: {}", article, e);
		}
	}

}
