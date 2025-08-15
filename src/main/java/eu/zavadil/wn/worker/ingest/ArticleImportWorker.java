package eu.zavadil.wn.worker.ingest;

import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.ArticleSourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ArticleImportWorker {

	@Autowired
	ArticleService articleService;

	@Autowired
	ArticleSourceService articleSourceService;

	@Autowired
	ArticleDataSourceContainer articleDataSourceContainer;

	@Scheduled(fixedDelay = 10 * 1000)
	public void execute() {
		ArticleSource articleSource = this.articleSourceService.getNextImportSource();
		if (articleSource == null) {
			log.error("No article source suitable for import found!");
			return;
		}

		ArticleDataSource articleDataSource = this.articleDataSourceContainer.get(articleSource.getImportType());

		if (articleDataSource == null) {
			log.error("No article data source found for import type {} !", articleSource.getImportType());
			return;
		}

		int totalArticles = 0;
		int updatedArticles = 0;
		int newArticles = 0;

		BasicIterator<ArticleData> iterator = articleDataSource.getIterator(articleSource);

		while (iterator.hasNext()) {
			totalArticles++;
			ArticleData articleData = iterator.next();
			Article article = this.articleService.loadByOriginalUrl(articleData.getOriginalUrl());
			if (article == null) {
				String url = StringUtils.safeTrim(articleData.getOriginalUrl());
				if (StringUtils.isBlank(url)) {
					continue;
				}
				newArticles++;
				article = new Article();
				article.setOriginalUrl(url);
			} else {
				boolean identical = StringUtils.safeEquals(article.getTitle(), articleData.getTitle())
					&& StringUtils.safeEquals(article.getSummary(), articleData.getSummary())
					&& StringUtils.safeEquals(article.getBody(), articleData.getBody());
				if (identical) {
					continue;
				}
				if (!StringUtils.safeEquals(article.getTitle(), articleData.getTitle())) {
					log.info("title mismatch");
					log.info(article.getTitle());
					log.info(articleData.getTitle());
				}
				if (!StringUtils.safeEquals(article.getSummary(), articleData.getSummary())) {
					log.info("summary mismatch");
				}
				if (!StringUtils.safeEquals(article.getBody(), articleData.getBody())) {
					log.info("body mismatch");
				}
				updatedArticles++;
			}

			article.setSource(articleSource);
			article.setLanguage(articleSource.getLanguage());
			article.setTitle(articleData.getTitle());
			article.setSummary(articleData.getSummary());
			article.setBody(articleData.getBody());
			article.setPublishDate(articleData.getPublishDate());
			article.setProcessingState(ProcessingState.NotReady);
			//article.setLastUpdatedOn(Instant.now());

			this.articleService.save(article);
		}

		log.info(
			"Processed article source {}. Total {} articles, {} new, {} updated.",
			articleSource.getUrl(),
			totalArticles,
			newArticles,
			updatedArticles
		);
	}
}
