package eu.zavadil.wn.api;

import eu.zavadil.wn.service.ArticleSourceService;
import eu.zavadil.wn.worker.ingest.IngestWorker;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}/ingest")
@Tag(name = "Ingest")
@Slf4j
public class IngestController {

	@Autowired
	IngestWorker ingestWorker;

	@Autowired
	ArticleSourceService articleSourceService;

	@PostMapping("start/{articleSourceId}")
	@Operation(summary = "Start ingestion")
	public void start(@PathVariable int articleSourceId) {
		this.ingestWorker.ingestDataSource(this.articleSourceService.get(articleSourceId));
	}

}
