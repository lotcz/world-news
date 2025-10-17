package eu.zavadil.wn.worker.ingest;

import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.ArticleSourceService;
import eu.zavadil.wn.util.ArticleScraper;
import eu.zavadil.wn.worker.ingest.data.ArticleDataSource;
import eu.zavadil.wn.worker.ingest.data.ArticleDataSourceContainer;
import eu.zavadil.wn.worker.ingest.data.ExternalArticleData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@Slf4j
public class IngestWorker extends SmartQueueProcessorBase<ArticleSource> implements IngestQueueProcessor {

	@Autowired
	ArticleService articleService;

	@Autowired
	ArticleSourceService articleSourceService;

	@Autowired
	ArticleDataSourceContainer articleDataSourceContainer;

	@Autowired
	public IngestWorker(IngestArticleSourceQueue queue) {
		super(queue);
	}

	public void ingestDataSource(ArticleSource articleSource) {
		log.info("Ingesting from {}", articleSource.getUrl());
		articleSource.setProcessingState(ProcessingState.Processing);
		this.articleSourceService.set(articleSource);

		ArticleDataSource articleDataSource = this.articleDataSourceContainer.get(articleSource.getImportType());

		if (articleDataSource == null) {
			log.error("No article data source found for import type {}!", articleSource.getImportType());
			return;
		}

		int totalArticles = 0;
		int updatedArticles = 0;
		int newArticles = 0;

		BasicIterator<ExternalArticleData> iterator = articleDataSource.getIterator(articleSource);

		while (iterator.hasNext()) {
			totalArticles++;
			ExternalArticleData articleData = iterator.next();
			String url = StringUtils.safeTrim(articleData.getOriginalUrl());
			if (StringUtils.isBlank(url)) {
				log.warn("Article has no URL: {}", articleData);
				continue;
			}
			if (StringUtils.isBlank(articleData.getUid())) {
				log.warn("Article has no UID: {}", articleData);
				continue;
			}

			Article article = this.articleService.loadByUid(articleSource.getId(), articleData.getUid());
			if (article == null) {
				article = new Article();
			} else {
				// dont redownload existing articles
				continue;
			}

			article.setSource(articleSource);
			article.setOriginalUrl(url);
			article.setUid(articleData.getUid());
			article.setLanguage(articleSource.getLanguage());
			article.setTitle(articleData.getTitle());

			// process body
			String body = articleData.getBody();

			if (StringUtils.isBlank(body) || body.length() < 255) {
				try {
					body = ArticleScraper.scrape(url);
				} catch (Exception e) {
					log.error("Failed downloading article body from {}: {}", url, e.getMessage());
					continue;
				}
			}

			// filter out lines
			List<String> filters = articleSource.getFilterOutLines();
			for (String filter : filters) {
				if (StringUtils.notBlank(filter)) {
					body = StringUtils.safeReplace(body, filter, "");
				}
			}

			// dont save articles with no sensible body
			if (StringUtils.isBlank(body) || body.length() < 100) {
				continue;
			}

			article.setBody(body);

			if (articleData.getPublishDate() != null) {
				article.setPublishDate(articleData.getPublishDate());
			} else if (article.getPublishDate() == null) {
				article.setPublishDate(Instant.now());
			}

			article.setProcessingState(ProcessingState.Waiting);
			this.articleService.save(article);
			newArticles++;
		}

		articleSource.setProcessingState(ProcessingState.Done);
		articleSource.setLastImported(Instant.now());
		this.articleSourceService.set(articleSource);

		log.info(
			"Loaded {} articles from {} - {} new, {} updated",
			totalArticles,
			articleSource.getUrl(),
			newArticles,
			updatedArticles
		);
	}

	@Override
	public void onBeforeProcessing() {
		// revive stuck sources (happens when killing the process)
		Instant maxImported = Instant.now().minus(Duration.ofMinutes(10));
		List<ArticleSource> stuck = this.articleSourceService.all()
			.stream()
			.filter(
				(ars) -> ars.getProcessingState().equals(ProcessingState.Processing)
					&& ars.getLastImported() != null && ars.getLastImported().isBefore(maxImported)
			).toList();
		stuck.forEach(
			ars -> {
				ars.setProcessingState(ProcessingState.Waiting);
				this.articleSourceService.set(ars);
			}
		);
	}

	@Override
	public void onAfterProcessing() {
		// reschedule ingestion
		List<ArticleSource> sources = this.articleSourceService.all()
			.stream()
			.filter(ars -> ars.getProcessingState().equals(ProcessingState.Done))
			.toList();
		sources.forEach(ars -> {
			ars.setProcessingState(ProcessingState.Waiting);
			this.articleSourceService.set(ars);
		});
		// reset article source cache so article counts can be reloaded
		if (this.getStats().getProcessed() > 0) {
			this.articleSourceService.reset();
		}

	}

	@Override
	public void processItem(ArticleSource ars) {
		try {
			this.ingestDataSource(ars);
		} catch (Exception e) {
			ars.setProcessingState(ProcessingState.Error);
			this.articleSourceService.set(ars);
			log.error("Ingestion of source {} failed:", ars.getUrl(), e);
		}
	}

	@Async
	public void ingestDataSourceAsync(ArticleSource articleSource) {
		this.ingestDataSource(articleSource);
		this.articleSourceService.reset();
	}

	@Async
	public void ingestAsync() {
		this.process();
	}

}
