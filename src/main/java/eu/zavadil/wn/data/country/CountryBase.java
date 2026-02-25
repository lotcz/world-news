package eu.zavadil.wn.data.country;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class CountryBase extends EntityWithNameBase {

	private boolean createOverview = false;

}
