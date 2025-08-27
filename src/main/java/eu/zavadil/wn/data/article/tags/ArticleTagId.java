package eu.zavadil.wn.data.article.tags;

import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.tag.Tag;
import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleTagId implements Serializable {

	@ManyToOne
	private Article article;

	@ManyToOne
	private Tag tag;
}
