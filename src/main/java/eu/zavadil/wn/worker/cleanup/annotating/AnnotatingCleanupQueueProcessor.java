package eu.zavadil.wn.worker.cleanup.annotating;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.article.Article;

public interface AnnotatingCleanupQueueProcessor extends SmartQueueProcessor<Article> {
}
