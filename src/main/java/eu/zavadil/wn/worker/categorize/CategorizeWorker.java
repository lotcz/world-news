package eu.zavadil.wn.worker.categorize;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.RealmService;
import eu.zavadil.wn.service.TopicService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CategorizeWorker extends SmartQueueProcessorBase<Topic> implements CategorizeQueueProcessor {

	@Autowired
	TopicService topicService;

	@Autowired
	RealmService realmService;

	@Autowired
	TopicEmbeddingsService topicEmbeddingsService;

	@Autowired
	public CategorizeWorker(CategorizeTopicQueue queue) {
		super(queue);
	}

	public void categorizeTopic(Topic topic) {
		Embedding topicEmbedding = this.topicEmbeddingsService.obtainEmbedding(topic);
		Realm realm = this.realmService.findMostSimilar(topicEmbedding);
		if (realm == null) {
			realm = this.realmService.getDefaultRealm();
		}
		topic.setRealm(realm);
		this.topicService.save(topic);
	}

	@Override
	public void onBeforeProcessing() {
		//log.info("Starting annotation...");
	}

	@Override
	public void onAfterProcessing() {
		if (this.getStats().getProcessed() > 0) {
			this.realmService.resetCache();
		}
	}

	@Override
	public void processItem(Topic t) {
		try {
			this.categorizeTopic(t);
		} catch (Exception e) {
			log.error("Topic categorization failed: {}", t, e);
		}
	}
}
