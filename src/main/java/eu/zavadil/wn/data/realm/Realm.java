package eu.zavadil.wn.data.realm;

import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
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
	indexes = {
		@Index(columnList = "name"),
	}
)
public class Realm extends EntityWithNameBase {

	@JsonProperty("isHidden")
	private boolean isHidden;

	@Column(name = "parent_id")
	private Integer parentId;

	@Column(columnDefinition = "text")
	private String summary;

	@Column(updatable = false, insertable = false)
	private int topicCount = 0;
}
