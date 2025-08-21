package eu.zavadil.wn.data.articleSource;

import eu.zavadil.wn.data.language.Language;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article_source")
public class ArticleSource extends ArticleSourceBase {

	@ManyToOne(optional = false)
	private Language language;

}
