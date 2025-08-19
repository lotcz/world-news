package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TopicService extends RepositoryNamedLookupCache<Topic> {

	@Autowired
	public TopicService(TopicRepository repository) {
		super(repository, Topic::new);
	}

}
