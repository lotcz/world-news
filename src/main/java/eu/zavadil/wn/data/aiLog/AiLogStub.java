package eu.zavadil.wn.data.aiLog;

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
		@Index(columnList = "processingState")
	}
)
public class AiLogStub extends ArticleSourceBase {

	@Column(name = "rodic_id")
	private Integer rodicId;

	@Column(name = "zeme_id")
	private Integer zemeId;

}
