package eu.zavadil.wn.data.website;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "website"
)
public class WebsiteStub extends WebsiteBase {

	@Column(name = "language_id", nullable = false)
	private Integer languageId;

}
