package eu.zavadil.wn.worker.ingest;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.articleSource.ArticleSource;

public interface IngestQueueProcessor extends SmartQueueProcessor<ArticleSource> {

	void ingestDataSourceAsync(ArticleSource articleSource);

}
