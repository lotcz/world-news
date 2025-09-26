package eu.zavadil.wn.data.banner;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "banner"
)
public class BannerStub extends BannerBase {

	@Column(name = "website_id", nullable = false)
	private int websiteId;

}
