package eu.zavadil.wn.worker.cleanup.ingesting;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.articleSource.ArticleSource;

public interface IngestingCleanupQueueProcessor extends SmartQueueProcessor<ArticleSource> {
}
