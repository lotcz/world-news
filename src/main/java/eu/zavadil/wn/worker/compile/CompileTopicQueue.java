package eu.zavadil.wn.worker.compile;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class CompileTopicQueue extends PagedSmartQueue<Topic> {

	@Autowired
	TopicRepository topicRepository;

	@Override
	public Page<Topic> loadRemaining() {
		return this.topicRepository.loadCompilationQueue(
			PageRequest.of(0, 10)
		);
	}

}
