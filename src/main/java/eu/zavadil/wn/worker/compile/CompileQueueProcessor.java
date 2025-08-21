package eu.zavadil.wn.worker.compile;

import eu.zavadil.java.queues.SmartQueueProcessor;
import eu.zavadil.wn.data.topic.Topic;

public interface CompileQueueProcessor extends SmartQueueProcessor<Topic> {
}
