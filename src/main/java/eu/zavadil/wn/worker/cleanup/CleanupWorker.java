package eu.zavadil.wn.worker.cleanup;

import eu.zavadil.wn.worker.cleanup.annotating.AnnotatingCleanupQueueProcessor;
import eu.zavadil.wn.worker.cleanup.ingesting.IngestingCleanupQueueProcessor;
import eu.zavadil.wn.worker.cleanup.synonyms.SynonymsCleanupQueueProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CleanupWorker {

	@Autowired
	SynonymsCleanupQueueProcessor synonymsCleanupWorker;

	@Autowired
	IngestingCleanupQueueProcessor ingestingCleanupWorker;

	@Autowired
	AnnotatingCleanupQueueProcessor annotatingCleanupWorker;

	public void cleanup() {
		this.synonymsCleanupWorker.process();
		this.ingestingCleanupWorker.process();
		this.annotatingCleanupWorker.process();
	}

}
