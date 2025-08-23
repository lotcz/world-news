package eu.zavadil.wn.worker.ingest.data.rss;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.feed.synd.SyndLink;
import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.util.ArticleScraper;
import eu.zavadil.wn.util.WnUtil;
import eu.zavadil.wn.util.XmlReaderUtil;
import eu.zavadil.wn.worker.ingest.data.ArticleData;

import java.util.List;

public class XmlReaderIterator implements BasicIterator<ArticleData> {

	private final int maxReadItems = 100;

	private List<SyndEntry> entries = null;

	private int processedItems = 0;

	private int index = 0;

	private String nextPageUrl;

	private void loadNextPage(String url) {
		SyndFeed feed = XmlReaderUtil.readFeed(url);
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
	public ArticleData next() {
		this.checkReloadNextPage();
		SyndEntry entry = this.entries.get(this.index);
		this.index++;
		this.processedItems++;

		ArticleData articleData = new ArticleData();
		articleData.setOriginalUrl(entry.getLink());
		articleData.setOriginalUid(entry.getUri());
		articleData.setTitle(WnUtil.normalizeAndClean(entry.getTitle()));
		articleData.setSummary((entry.getDescription() != null) ? WnUtil.normalizeAndClean(entry.getDescription().getValue()) : null);
		articleData.setPublishDate(entry.getPublishedDate() == null ? null : entry.getPublishedDate().toInstant());

		String body = ArticleScraper.scrape(entry.getLink());
		body = StringUtils.safeReplace(body, "Článek si také můžete poslechnout v audioverzi.", "");
		articleData.setBody(StringUtils.safeTrim(body));

		return articleData;
	}
}
