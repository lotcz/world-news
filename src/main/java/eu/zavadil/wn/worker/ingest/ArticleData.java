package eu.zavadil.wn.worker.ingest;

import lombok.Data;

import java.time.Instant;

@Data
public class ArticleData {

	private String title;

	private String summary;

	private String body;

	private String originalUrl;

	private Instant publishDate;
}
