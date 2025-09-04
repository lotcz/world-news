package eu.zavadil.wn.worker.cleanup.topics;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.topic.Topic;

public interface TopicsCleanupQueueProcessor extends SmartQueueProcessor<Topic> {
}
