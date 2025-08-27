package eu.zavadil.wn.data.tag;

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
	name = "tag",
	indexes = {
		@Index(columnList = "name", unique = true),
		@Index(columnList = "synonymOfId"),
	}
)
public class TagStub extends TagBase {

	@Column(name = "synonym_of_id")
	private Integer synonymOfId;

}
