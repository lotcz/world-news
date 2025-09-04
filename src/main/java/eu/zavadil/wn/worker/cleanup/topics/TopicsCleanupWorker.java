package eu.zavadil.wn.worker.cleanup.topics;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.TopicService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Find topics with no articles and delete them
 */
@Service
@Slf4j
public class TopicsCleanupWorker extends SmartQueueProcessorBase<Topic> implements TopicsCleanupQueueProcessor {

	@Autowired
	TopicService topicService;

	@Autowired
	public TopicsCleanupWorker(TopicsCleanupQueue queue) {
		super(queue);
	}

	@Override
	public void processItem(Topic topic) {
		try {
			this.topicService.deleteById(topic.getId());
		} catch (Exception e) {
			log.error("Topic cleanup failed: {}", topic, e);
		}
	}

}
