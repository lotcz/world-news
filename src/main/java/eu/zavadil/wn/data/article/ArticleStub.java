package eu.zavadil.wn.data.article;

import eu.zavadil.wn.data.articleSource.ArticleSourceBase;
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
		@Index(columnList = "originalUrl", unique = true)
	}
)
public class ArticleStub extends ArticleSourceBase {

	@Column(name = "topic_id")
	private Integer topicId;

	@Column(name = "source_id")
	private Integer sourceId;

	@Column(name = "language_id")
	private Integer languageId;
}
