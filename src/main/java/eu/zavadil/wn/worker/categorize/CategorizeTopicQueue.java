package eu.zavadil.wn.worker.categorize;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class CategorizeTopicQueue extends PagedSmartQueue<Topic> {

	@Autowired
	TopicRepository topicRepository;

	@Override
	public Page<Topic> loadRemaining() {
		return this.topicRepository
			.findAllByProcessingStateAndRealmIdIsNullAndArticleCountInternalGreaterThan(
				ProcessingState.Done,
				0,
				PageRequest.of(0, 10)
			);
	}

}
