package eu.zavadil.wn.worker.ingest.data.rss;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.feed.synd.SyndLink;
import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.util.ArticleScraper;
import eu.zavadil.wn.util.RssFeedUtil;
import eu.zavadil.wn.worker.ingest.data.ExternalArticleData;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public class XmlReaderIterator implements BasicIterator<ExternalArticleData> {

	private final int maxReadItems = 100;

	private List<SyndEntry> entries = null;

	private int processedItems = 0;

	private int index = 0;

	private String nextPageUrl;

	private void loadNextPage(String url) {
		SyndFeed feed = RssFeedUtil.readFeed(url);
		this.entries = feed.getEntries();
		this.index = 0;
		this.nextPageUrl = null;
		for (SyndLink link : feed.getLinks()) {
			if ("next".equals(link.getRel())) {
				this.nextPageUrl = link.getHref();
				break;
			}
		}
	}

	private void checkReloadNextPage() {
		if (this.index >= this.entries.size() && StringUtils.notBlank(this.nextPageUrl)) {
			this.loadNextPage(this.nextPageUrl);
		}
	}

	public XmlReaderIterator(String url) {
		this.loadNextPage(url);
	}

	@Override
	public boolean hasNext() {
		this.checkReloadNextPage();
		return (this.entries.size() > this.index)
			&& (this.processedItems < this.maxReadItems);
	}

	@Override
	public ExternalArticleData next() {
		this.checkReloadNextPage();
		SyndEntry entry = this.entries.get(this.index);
		this.index++;
		this.processedItems++;

		ExternalArticleData articleData = new ExternalArticleData();
		articleData.setOriginalUrl(entry.getLink());
		articleData.setUid(entry.getUri());
		articleData.setTitle(ArticleScraper.sanitizeText(entry.getTitle()));
		articleData.setSummary((entry.getDescription() != null) ? ArticleScraper.sanitizeText(entry.getDescription().getValue()) : null);
		articleData.setPublishDate(entry.getPublishedDate() == null ? null : entry.getPublishedDate().toInstant());

		String body = ArticleScraper.sanitizeText(RssFeedUtil.getBestContent(entry));
		articleData.setBody(body);

		return articleData;
	}
}
