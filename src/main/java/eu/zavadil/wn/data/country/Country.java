package eu.zavadil.wn.data.country;

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
public class Country extends EntityWithNameBase {

	private String code;


}
