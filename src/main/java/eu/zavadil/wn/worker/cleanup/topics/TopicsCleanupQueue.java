package eu.zavadil.wn.worker.cleanup.topics;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class TopicsCleanupQueue extends PagedSmartQueue<Topic> {

	@Autowired
	TopicRepository topicRepository;

	@Override
	public Page<Topic> loadRemaining() {
		Instant before = Instant.now().minus(Duration.ofMinutes(15));
		return this.topicRepository.findAllByArticleCountAndLastUpdatedOnBefore(
			0,
			before,
			PageRequest.of(0, 10)
		);
	}

}
