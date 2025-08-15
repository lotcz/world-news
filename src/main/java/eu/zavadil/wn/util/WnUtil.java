package eu.zavadil.wn.util;

import lombok.extern.slf4j.Slf4j;

import java.text.Normalizer;

@Slf4j
public class WnUtil {

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

}
