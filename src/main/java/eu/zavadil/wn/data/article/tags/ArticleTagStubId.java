package eu.zavadil.wn.data.article.tags;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleTagStubId implements Serializable {

	@Column(name = "article_id")
	private int articleId;

	@Column(name = "tag_id")
	private int tagId;
}
