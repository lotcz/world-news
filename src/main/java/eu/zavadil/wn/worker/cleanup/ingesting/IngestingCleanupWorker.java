package eu.zavadil.wn.worker.cleanup.ingesting;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.service.ArticleSourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Find article sources stuck in Processing state and restart them
 */
@Service
@Slf4j
public class IngestingCleanupWorker extends SmartQueueProcessorBase<ArticleSource> implements IngestingCleanupQueueProcessor {

	@Autowired
	ArticleSourceService articleSourceService;

	@Autowired
	public IngestingCleanupWorker(IngestingCleanupQueue queue) {
		super(queue);
	}

	public void cleanup(ArticleSource articleSource) {
		articleSource.setProcessingState(ProcessingState.Waiting);
		this.articleSourceService.set(articleSource);
	}

	@Override
	public void processItem(ArticleSource articleSource) {
		try {
			this.cleanup(articleSource);
		} catch (Exception e) {
			log.error("Ingesting cleanup failed: {}", articleSource, e);
		}
	}

}
