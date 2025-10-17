package eu.zavadil.wn.util;

import eu.zavadil.java.util.StringUtils;
import net.dankito.readability4j.Article;
import net.dankito.readability4j.Readability4J;
import org.apache.commons.text.StringEscapeUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class ArticleScraper {

	public static String sanitizeText(String text) {
		if (StringUtils.isBlank(text)) return null;

		return WnStringUtil.normalizeAndClean(
			Jsoup.parse(StringEscapeUtils.unescapeHtml4(text.replace("\0", ""))).text()
		);
	}

	public static String scrape(String url) {
		try {
			// Fetch HTML
			Document doc = Jsoup.connect(url)
				.userAgent("Mozilla/5.0")
				.timeout(10000)
				.get();

			// Use Readability4J to get main content
			Readability4J readability = new Readability4J(url, doc.html());
			Article article = readability.parse();

			return ArticleScraper.sanitizeText(article.getTextContent());

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

}
