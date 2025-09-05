package eu.zavadil.wn.worker.categorize;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.topic.Topic;

public interface CategorizeQueueProcessor extends SmartQueueProcessor<Topic> {
}
