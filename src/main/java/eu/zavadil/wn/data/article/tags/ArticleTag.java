package eu.zavadil.wn.data.article.tags;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@Entity
public class ArticleTag {

	@EmbeddedId
	private ArticleTagId id;

}
