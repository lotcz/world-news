package eu.zavadil.wn.data.tag;

import eu.zavadil.wn.data.language.Language;
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

	@ManyToOne
	private Language language;

}
