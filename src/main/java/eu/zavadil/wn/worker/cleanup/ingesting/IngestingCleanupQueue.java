package eu.zavadil.wn.worker.cleanup.ingesting;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.service.ArticleSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class IngestingCleanupQueue extends PagedSmartQueue<ArticleSource> {

	@Autowired
	ArticleSourceService articleSourceService;

	@Override
	public Page<ArticleSource> loadRemaining() {
		return this.articleSourceService.loadStuckSources();
	}

}
