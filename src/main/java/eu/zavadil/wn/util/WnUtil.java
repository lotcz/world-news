package eu.zavadil.wn.util;

import eu.zavadil.java.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;

import java.text.Normalizer;

@Slf4j
public class WnUtil {

	/**
	 * Normalized bytes and spaces in content coming from external sources
	 */
	public static String normalizeAndClean(String input) {
		if (input == null) {
			return null;
		}

		// Normalize to NFC (composed form) so characters are consistent
		String result = Normalizer.normalize(input, Normalizer.Form.NFC);

		// Replace all Unicode spaces (including NBSP, thin space, etc.) with a normal space
		result = result.replaceAll("\\p{Z}+", " ");

		// Remove zero-width spaces, BOM, and other invisible characters
		result = result.replaceAll("[\\u200B-\\u200D\\uFEFF]", "");

		// Trim normal spaces at start/end
		result = result.trim();

		return result;
	}

	public static String removeWrappingQuotes(String text) {
		if (StringUtils.isBlank(text)) return "";
		if ((text.startsWith("\"") && text.endsWith("\"") || (text.startsWith("„") && text.endsWith("“")))) {
			return text.substring(1, text.length() - 1);
		}
		return text;
	}

	public static String removeWrappingAsterisks(String text) {
		if (StringUtils.isBlank(text)) return "";
		if (text.startsWith("*") && text.endsWith("*")) {
			return removeWrappingAsterisks(text.substring(1, text.length() - 1));
		}
		return text;
	}

	public static String HtmlToText(String html) {
		if (StringUtils.isBlank(html)) return null;
		return Jsoup.parse(html).text();
	}

}
