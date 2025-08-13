package eu.zavadil.wn.data.tag;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
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
public class Tag extends EntityWithNameBase {

	private String summary;


}
