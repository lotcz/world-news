package eu.zavadil.wn.worker.ingest;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Instant;

@Service
@Slf4j
public class IngestWorker {

	@Autowired
	ArticleService articleService;

	@Scheduled(fixedDelay = 10000)
	public void execute() {
		log.info("Starting import");
		try {
			try (XmlReader reader = new XmlReader(new URL("https://www.novinky.cz/rss"))) {
				SyndFeed feed = new SyndFeedInput().build(reader);

				for (SyndEntry entry : feed.getEntries()) {
					Article article = this.articleService.loadByOriginalUrl(entry.getLink());
					if (article != null) {
						continue;
					}

					article = new Article();
					article.setOriginalUrl(entry.getLink());
					article.setTitle(entry.getTitle());
					article.setAnnotation((entry.getDescription() != null) ? entry.getDescription().getValue() : "");
					article.setSummary(article.getAnnotation());
					article.setPublishDate(entry.getPublishedDate() == null ? Instant.now() : entry.getPublishedDate().toInstant());
					article.setProcessingState(ProcessingState.NotReady);

					this.articleService.save(article);
				}
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
}
