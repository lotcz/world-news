package eu.zavadil.wn.data.article.tags;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@Entity
@Table(name = "article_tag")
public class ArticleTagStub {

	@EmbeddedId
	private ArticleTagStubId id;

}
