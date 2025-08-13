package eu.zavadil.wn.data.realm;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	indexes = {
		@Index(columnList = "name"),
	}
)
public class Realm extends EntityWithNameBase {

	@Column(columnDefinition = "text")
	private String summary;

	@ManyToMany(mappedBy = "realms")
	private Set<ArticleSource> sources = new HashSet<>();

}
