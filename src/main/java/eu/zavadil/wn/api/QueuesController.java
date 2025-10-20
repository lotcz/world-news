package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.ArticleSourceService;
import eu.zavadil.wn.service.TopicService;
import eu.zavadil.wn.worker.ingest.IngestQueueProcessor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/queues")
@Tag(name = "Queues")
@Slf4j
public class QueuesController {

	@Autowired
	IngestQueueProcessor ingestWorker;

	@Autowired
	ArticleSourceService articleSourceService;

	@Autowired
	TopicService topicService;

	@Autowired
	ArticleService articleService;

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

	@GetMapping("topic/approval-queue")
	public JsonPage<Topic> loadTopicApprovalQueue(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.topicService.loadApprovalQueue(PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("topic/image-supply-queue")
	public JsonPage<Topic> loadTopicImageSupplyQueue(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.topicService.loadImageSupplyQueue(PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("article/approval-queue")
	public JsonPage<Article> loadArticleApprovalQueue(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleService.loadApprovalQueue(PagingUtils.of(page, size, sorting)));
	}

	@Data
	public static class QueueSizes {
		private int topicApproval;
		private int topicImageSupply;
		private int articleApproval;
	}

	@GetMapping("sizes")
	public QueueSizes loadQueueSizes() {
		QueueSizes queueSizes = new QueueSizes();
		queueSizes.setTopicApproval(this.topicService.loadApprovalQueueSize());
		queueSizes.setTopicImageSupply(this.topicService.loadImageSupplyQueueSize());
		queueSizes.setArticleApproval(this.articleService.loadApprovalQueueSize());
		return queueSizes;
	}
}
