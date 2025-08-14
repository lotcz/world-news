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

	@Scheduled(fixedDelay = 10 * 60 * 1000)
	public void execute() {
		ArticleSource articleSource = this.articleSourceService.getNextImportSource();
		if (articleSource == null) {
			log.info("No article source suitable for import found!");
			return;
		}

		log.info("Importing articles from {}", articleSource.getUrl());

		ArticleDataSource articleDataSource = this.articleDataSourceContainer.get(articleSource.getImportType());

		if (articleDataSource == null) {
			log.info("No article data source found for import type {} !", articleSource.getImportType());
			return;
		}

		BasicIterator<ArticleData> iterator = articleDataSource.getIterator(articleSource);

		while (iterator.hasNext()) {
			ArticleData articleData = iterator.next();
			Article article = this.articleService.loadByOriginalUrl(articleData.getOriginalUrl());
			if (article == null) {
				String url = StringUtils.safeTrim(articleData.getOriginalUrl());
				if (StringUtils.isBlank(url)) {
					continue;
				}
				article = new Article();
				article.setOriginalUrl(url);
			} else {
				boolean identical = StringUtils.safeEquals(article.getTitle(), articleData.getTitle())
					&& StringUtils.safeEquals(article.getSummary(), articleData.getSummary())
					&& StringUtils.safeEquals(article.getBody(), articleData.getBody());
				if (identical) {
					log.info("Article identical skipping.");
					continue;
				}
			}

			article.setTitle(articleData.getTitle());
			article.setSummary(articleData.getSummary());
			article.setPublishDate(articleData.getPublishDate());
			article.setProcessingState(ProcessingState.NotReady);

			this.articleService.save(article);
		}

	}
}
