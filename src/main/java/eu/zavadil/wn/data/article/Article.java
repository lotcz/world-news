package eu.zavadil.wn.data.article;

import eu.zavadil.wn.data.country.Country;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Article extends ArticleBase {

	@ManyToOne
	private Article rodic;

	@ManyToOne
	private Country zeme;

}
