package eu.zavadil.wn.worker.annotate;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.article.Article;

public interface AnnotateQueueProcessor extends SmartQueueProcessor<Article> {
}
