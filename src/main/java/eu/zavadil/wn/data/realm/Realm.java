package eu.zavadil.wn.data.realm;

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

	@Column(name = "parent_id")
	private Integer parentId;

	@Column(columnDefinition = "text")
	private String summary;

}
