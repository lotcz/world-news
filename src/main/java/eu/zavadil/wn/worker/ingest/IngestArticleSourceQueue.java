package eu.zavadil.wn.worker.ingest;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.wn.data.ImportType;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.service.ArticleSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngestArticleSourceQueue extends PagedSmartQueue<ArticleSource> {

	@Autowired
	ArticleSourceService articleSourceService;

	@Override
	public Page<ArticleSource> loadRemaining() {
		List<ArticleSource> sources = this.articleSourceService
			.all()
			.stream()
			.filter((ArticleSource ars) -> (ars.getImportType() != ImportType.Internal))
			.toList();
		return new PageImpl<>(
			sources,
			PageRequest.of(0, 1),
			sources.size()
		);
	}

}
