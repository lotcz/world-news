package eu.zavadil.wn.data.topic;

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
public class TopicStub extends TopicBase {

	@Column(name = "realm_id")
	private Integer realmId;

	@Column(name = "main_image_id")
	private Integer mainImageId;

}
