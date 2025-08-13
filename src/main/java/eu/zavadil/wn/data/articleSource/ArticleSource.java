package eu.zavadil.wn.data.articleSource;

import eu.zavadil.wn.data.language.Language;
import eu.zavadil.wn.data.realm.Realm;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "article_source")
public class ArticleSource extends ArticleSourceBase {

	@ManyToOne
	private Language language;

	@ManyToMany
	@JoinTable(
		name = "article_source_realm",
		joinColumns = @JoinColumn(name = "article_source_id"),
		inverseJoinColumns = @JoinColumn(name = "realm_id")
	)
	private Set<Realm> realms = new HashSet<>();

}
