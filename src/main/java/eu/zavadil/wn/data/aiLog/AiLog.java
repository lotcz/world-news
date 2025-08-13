package eu.zavadil.wn.data.aiLog;

import eu.zavadil.wn.data.country.Country;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class AiLog extends AiLogBase {

	@ManyToOne
	private AiLog rodic;

	@ManyToOne
	private Country zeme;

}
