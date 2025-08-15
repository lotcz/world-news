package eu.zavadil.wn.data.articleSource;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article_source",
	indexes = {
		@Index(columnList = "url")
	}
)
public class ArticleSourceStub extends ArticleSourceBase {

	@Column(name = "language_id", nullable = false)
	private Integer languageId;

}
