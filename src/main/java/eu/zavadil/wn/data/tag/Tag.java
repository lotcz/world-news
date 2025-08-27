package eu.zavadil.wn.data.tag;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Tag extends TagBase {

	@ManyToOne
	private Tag synonymOf;

}
