package eu.zavadil.wn.data.article;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "article",
	indexes = {
		@Index(columnList = "processingState"),
		@Index(columnList = "originalUrl", unique = true),
		@Index(columnList = "topicId"),
		@Index(columnList = "sourceId")
	}
)
public class ArticleStub extends ArticleBase {

	@Column(name = "topic_id")
	private Integer topicId;

	@Column(name = "source_id", nullable = false)
	private Integer sourceId;

	@Column(name = "language_id", nullable = false)
	private Integer languageId;
}
