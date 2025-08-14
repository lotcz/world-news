package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.wn.data.ProcessingState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ArticleBase extends EntityBase {

	private static final int TITLE_SIZE = 255;

	@Column(length = TITLE_SIZE)
	@Size(max = TITLE_SIZE)
	private String title;

	public void setTitle(String title) {
		this.title = this.truncateString(title, TITLE_SIZE);
	}

	private Instant publishDate;

	private String originalUrl;

	@Column(columnDefinition = "TEXT")
	private String annotation;

	@Column(columnDefinition = "TEXT")
	private String summary;

	@Column(columnDefinition = "TEXT")
	private String body;

	private ProcessingState processingState = ProcessingState.NotReady;

}
