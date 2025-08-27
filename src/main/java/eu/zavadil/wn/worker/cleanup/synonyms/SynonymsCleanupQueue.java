package eu.zavadil.wn.worker.cleanup.synonyms;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class SynonymsCleanupQueue extends PagedSmartQueue<Tag> {

	@Autowired
	TagService tagService;

	@Override
	public Page<Tag> loadRemaining() {
		return this.tagService.loadSynonymsForCleanup();
	}

}
