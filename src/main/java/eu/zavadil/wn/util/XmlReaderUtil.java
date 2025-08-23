package eu.zavadil.wn.util;

import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import org.mozilla.universalchardet.UniversalDetector;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.zip.GZIPInputStream;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

public class XmlReaderUtil {

	private static final int MAX_REDIRECTS = 5;

	private static InputStream wrapStream(InputStream in, String encoding) throws IOException {
		if (encoding == null) {
			return in;
		}
		switch (encoding.toLowerCase()) {
			case "gzip":
				return new GZIPInputStream(in);
			case "deflate":
				return new InflaterInputStream(in, new Inflater(true));
			default:
				return in; // unknown encoding, just return raw
		}
	}

	private static SyndFeed readFeed(String feedUrl, int redirectCount) {
		if (redirectCount > MAX_REDIRECTS) {
			throw new RuntimeException("Too many redirects for feed: " + feedUrl);
		}

		try {
			HttpURLConnection conn = (HttpURLConnection) new URL(feedUrl).openConnection();

			// Browser-like headers
			conn.setRequestProperty("User-Agent",
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
					"AppleWebKit/537.36 (KHTML, like Gecko) " +
					"Chrome/115.0 Safari/537.36");
			conn.setRequestProperty("Accept",
				"application/rss+xml, application/xml;q=0.9, */*;q=0.8");
			conn.setRequestProperty("Accept-Encoding", "gzip, deflate");
			conn.setInstanceFollowRedirects(false); // handle manually
			conn.setConnectTimeout(10000);
			conn.setReadTimeout(10000);

			int code = conn.getResponseCode();
			if (code == HttpURLConnection.HTTP_MOVED_PERM ||
				code == HttpURLConnection.HTTP_MOVED_TEMP ||
				code == 307 || code == 308) {
				String location = conn.getHeaderField("Location");
				return readFeed(location, redirectCount + 1);
			}

			if (code != HttpURLConnection.HTTP_OK) {
				throw new IOException("HTTP " + code + " from " + feedUrl);
			}

			byte[] data;
			try (InputStream raw = conn.getInputStream();
				 InputStream in = wrapStream(raw, conn.getContentEncoding())) {
				data = in.readAllBytes();
			}

			if (data.length == 0) {
				throw new IOException("Empty response from " + feedUrl);
			}

			// Step 1: Try charset from Content-Type
			String contentType = conn.getContentType();
			String charset = null;
			if (contentType != null && contentType.toLowerCase().contains("charset=")) {
				charset = contentType.substring(contentType.toLowerCase().indexOf("charset=") + 8).trim();
			}

			// Step 2: Fallback to juniversalchardet
			if (charset == null) {
				UniversalDetector detector = new UniversalDetector(null);
				detector.handleData(data, 0, data.length);
				detector.dataEnd();
				charset = detector.getDetectedCharset();
			}

			// Step 3: Default UTF-8
			if (charset == null) charset = "UTF-8";

			String xml = new String(data, Charset.forName(charset));

			SyndFeedInput input = new SyndFeedInput();
			return input.build(new StringReader(xml));

		} catch (Exception e) {
			throw new RuntimeException("Error when reading feed: " + feedUrl, e);
		}
	}

	public static SyndFeed readFeed(String feedUrl) {
		return readFeed(feedUrl, 0);
	}
}
