package eu.zavadil.wn.api;

import eu.zavadil.wn.service.ArticleSourceService;
import eu.zavadil.wn.worker.ingest.IngestQueueProcessor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}/queues")
@Tag(name = "Queues")
@Slf4j
public class QueuesController {

	@Autowired
	IngestQueueProcessor ingestWorker;

	@Autowired
	ArticleSourceService articleSourceService;

	@PostMapping("ingest/start")
	@Operation(summary = "Start ingestion")
	@Async
	public void startIngestion() {
		this.ingestWorker.ingestAsync();
	}

	@PostMapping("ingest/start/{articleSourceId}")
	@Operation(summary = "Start ingestion by source")
	public void startIngestionBySource(@PathVariable int articleSourceId) {
		this.ingestWorker.ingestDataSourceAsync(this.articleSourceService.get(articleSourceId));
	}

}
