package eu.zavadil.wn.worker.ingest.data;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class ArticleData {

	private String title;

	private String summary;

	private String body;

	private String originalUrl;

	private String originalUid;

	private Instant publishDate;

	private List<ImageData> images;
}
