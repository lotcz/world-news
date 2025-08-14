package eu.zavadil.wn.data.image;

import eu.zavadil.wn.data.article.Article;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Image extends ImageBase {

	@ManyToOne
	private Article article;

}
