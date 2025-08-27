package eu.zavadil.wn.worker.cleanup.synonyms;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.tag.Tag;

public interface SynonymsCleanupQueueProcessor extends SmartQueueProcessor<Tag> {
}
