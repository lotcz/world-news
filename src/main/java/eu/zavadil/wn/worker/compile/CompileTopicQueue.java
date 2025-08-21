package eu.zavadil.wn.worker.compile;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class CompileTopicQueue extends PagedSmartQueue<Topic> {

	@Autowired
	TopicService topicService;

	@Override
	public Page<Topic> loadRemaining() {
		return this.topicService.loadTopicsForCompilation();
	}

}
