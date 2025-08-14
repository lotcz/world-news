package eu.zavadil.wn.data.topic;

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
	name = "topic",
	indexes = {
		@Index(columnList = "processingState")
	}
)
public class TopicStub extends ArticleSourceBase {

	@Column(name = "realm_id")
	private Integer realmId;

}
