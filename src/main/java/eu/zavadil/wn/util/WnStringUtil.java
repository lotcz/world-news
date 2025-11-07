package eu.zavadil.wn.util;

import eu.zavadil.java.util.IntegerUtils;
import eu.zavadil.java.util.StringUtils;
import lombok.extern.slf4j.Slf4j;

import java.text.Normalizer;
import java.util.List;

@Slf4j
public class WnStringUtil {

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

	public static String replaceQuotes(String text) {
		if (StringUtils.isBlank(text)) return "";
		List<String> strings = StringUtils.safeSplit(text, "\"");
		int length = strings.size();
		boolean endsWithQuote = StringUtils.safeEndsWith(text, "\"");
		if (length < 1 || (IntegerUtils.isEven(length) && !endsWithQuote)) {
			return text;
		}
		StringBuilder result = new StringBuilder();
		result.append(strings.get(0));
		boolean first = true;
		for (int i = 1; i < length; i++) {
			result.append(first ? "„" : "“");
			first = !first;
			result.append(strings.get(i));
		}
		if (endsWithQuote) {
			result.append("“");
		}
		return result.toString();
	}

}
