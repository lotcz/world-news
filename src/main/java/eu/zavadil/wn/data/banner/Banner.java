package eu.zavadil.wn.data.banner;

import eu.zavadil.wn.data.website.Website;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Banner extends BannerBase {

	@ManyToOne
	private Website website;

}
