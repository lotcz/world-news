package eu.zavadil.wn.data.language;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
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
public class Language extends EntityWithNameBase {

	private static final int CODE_SIZE = 5;

	@Column(length = CODE_SIZE)
	@Size(max = CODE_SIZE)
	private String code;

}
