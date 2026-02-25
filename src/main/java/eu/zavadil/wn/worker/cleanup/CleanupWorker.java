package eu.zavadil.wn.worker.cleanup;

import eu.zavadil.wn.worker.cleanup.annotating.AnnotatingCleanupQueueProcessor;
import eu.zavadil.wn.worker.cleanup.synonyms.SynonymsCleanupQueueProcessor;
import eu.zavadil.wn.worker.cleanup.topics.TopicsCleanupQueueProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CleanupWorker {

	@Autowired
	SynonymsCleanupQueueProcessor synonymsCleanupWorker;

	@Autowired
	AnnotatingCleanupQueueProcessor annotatingCleanupWorker;

	@Autowired
	TopicsCleanupQueueProcessor topicsCleanupWorker;

	public void cleanup() {
		this.synonymsCleanupWorker.process();
		this.annotatingCleanupWorker.process();
		this.topicsCleanupWorker.process();
	}

}
