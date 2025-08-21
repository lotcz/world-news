package eu.zavadil.wn.worker.ingest.data.rss;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.util.ArticleScraper;
import eu.zavadil.wn.util.WnUtil;
import eu.zavadil.wn.worker.ingest.data.ArticleData;
import org.mozilla.universalchardet.UniversalDetector;

import java.io.InputStream;
import java.io.StringReader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.List;

public class XmlReaderIterator implements BasicIterator<ArticleData> {

	private final List<SyndEntry> entries;

	private int index = 0;

	public static SyndFeed readFeed(String feedUrl) {
		try {
			URLConnection conn = new URL(feedUrl).openConnection();
			byte[] data;

			try (InputStream in = conn.getInputStream()) {
				data = in.readAllBytes();
			}

			// Step 1: Try HTTP Content-Type first
			String contentType = conn.getContentType(); // e.g. "application/rss+xml; charset=windows-1250"
			String charset = null;
			if (contentType != null && contentType.contains("charset=")) {
				charset = contentType.substring(contentType.indexOf("charset=") + 8).trim();
			}

			// Step 2: If still unknown, use juniversalchardet
			if (charset == null) {
				UniversalDetector detector = new UniversalDetector(null);
				detector.handleData(data, 0, data.length);
				detector.dataEnd();
				charset = detector.getDetectedCharset();
			}

			// Step 3: Fallback default
			if (charset == null) {
				charset = "UTF-8"; // safe default
			}
			
			// Step 4: Decode using detected charset
			String xml = new String(data, Charset.forName(charset));

			// Step 5: Parse with Rome
			SyndFeedInput input = new SyndFeedInput();
			return input.build(new StringReader(xml));
		} catch (Exception e) {
			throw new RuntimeException("Error when reading feed!", e);
		}
	}

	public XmlReaderIterator(String url) {
		this.entries = readFeed(url).getEntries();
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

		String body = ArticleScraper.scrape(entry.getLink());
		body = StringUtils.safeReplace(body, "Článek si také můžete poslechnout v audioverzi.", "");
		articleData.setBody(StringUtils.safeTrim(body));

		return articleData;
	}
}
