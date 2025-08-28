package eu.zavadil.wn.worker.ingest;

import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.ArticleSourceService;
import eu.zavadil.wn.worker.ingest.data.ArticleData;
import eu.zavadil.wn.worker.ingest.data.ArticleDataSource;
import eu.zavadil.wn.worker.ingest.data.ArticleDataSourceContainer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;

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

		BasicIterator<ArticleData> iterator = articleDataSource.getIterator(articleSource);

		while (iterator.hasNext()) {
			totalArticles++;
			ArticleData articleData = iterator.next();
			String url = StringUtils.safeTrim(articleData.getOriginalUrl());
			if (StringUtils.isBlank(url)) {
				log.warn("Article has no URL: {}", articleData);
				continue;
			}
			Article article = this.articleService.loadByOriginalUrlOrUid(url, articleData.getOriginalUid());
			if (article == null) {
				newArticles++;
				article = new Article();
			} else {
				boolean titleIdentical = StringUtils.safeEquals(article.getTitle(), articleData.getTitle())
					|| StringUtils.isBlank(articleData.getTitle());
				boolean bodyIdentical = StringUtils.safeEquals(article.getBody(), articleData.getBody())
					|| StringUtils.isBlank(articleData.getBody());
				if (titleIdentical && bodyIdentical) {
					continue;
				}
				updatedArticles++;
			}

			article.setSource(articleSource);
			article.setOriginalUrl(url);
			article.setOriginalUid(articleData.getOriginalUid());
			article.setLanguage(articleSource.getLanguage());
			article.setTitle(articleData.getTitle());

			// dont import summary, generate our own
			//if (StringUtils.notBlank(articleData.getSummary())) {
			//	article.setSummary(articleData.getSummary());
			//}

			if (StringUtils.notBlank(articleData.getBody())) {
				article.setBody(articleData.getBody());
			}

			if (articleData.getPublishDate() != null) {
				article.setPublishDate(articleData.getPublishDate());
			} else if (article.getPublishDate() == null) {
				article.setPublishDate(Instant.now());
			}

			article.setProcessingState(ProcessingState.Waiting);
			this.articleService.save(article);
		}

		articleSource.setProcessingState(ProcessingState.Waiting);
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

	@Async
	public void ingestDataSourceAsync(ArticleSource articleSource) {
		this.ingestDataSource(articleSource);
	}

	@Override
	public void onBeforeProcessing() {

	}

	@Override
	public void onAfterProcessing() {
		// reset article source cache so article counts can be reloaded
		this.articleSourceService.reset();
	}

	@Override
	public void processItem(ArticleSource ars) {
		try {
			this.ingestDataSource(ars);
		} catch (Exception e) {
			log.error("Ingestion of source {} failed:", ars.getUrl(), e);
		}
	}
}
