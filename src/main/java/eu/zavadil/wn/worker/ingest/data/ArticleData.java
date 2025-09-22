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

	private String uid;

	private Instant publishDate;

	private ImageData mainImage;

	private List<ImageData> images;
}
