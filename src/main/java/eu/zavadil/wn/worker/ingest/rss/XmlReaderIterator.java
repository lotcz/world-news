package eu.zavadil.wn.worker.ingest.rss;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.wn.util.WnUtil;
import eu.zavadil.wn.worker.ingest.ArticleData;

import java.net.URL;
import java.util.List;

public class XmlReaderIterator implements BasicIterator<ArticleData> {

	private final List<SyndEntry> entries;

	private int index = 0;

	public XmlReaderIterator(String url) {
		try {
			try (XmlReader xmlReader = new XmlReader(new URL(url))) {
				SyndFeed feed = new SyndFeedInput().build(xmlReader);
				this.entries = feed.getEntries();
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public boolean hasNext() {
		return this.entries.size() > this.index;
	}

	@Override
	public ArticleData next() {
		SyndEntry entry = this.entries.get(this.index);
		this.index++;
		ArticleData articleData = new ArticleData();
		articleData.setOriginalUrl(entry.getLink());
		articleData.setTitle(WnUtil.normalizeAndClean(entry.getTitle()));
		articleData.setSummary((entry.getDescription() != null) ? WnUtil.normalizeAndClean(entry.getDescription().getValue()) : null);
		articleData.setPublishDate(entry.getPublishedDate() == null ? null : entry.getPublishedDate().toInstant());

		// todo: load body

		return articleData;
	}
}
