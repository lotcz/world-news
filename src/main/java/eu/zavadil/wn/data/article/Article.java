package eu.zavadil.wn.data.article;

import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.data.image.Image;
import eu.zavadil.wn.data.language.Language;
import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.data.topic.Topic;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Article extends ArticleBase {

	@ManyToOne
	private Topic topic;

	@ManyToOne(optional = false)
	private ArticleSource source;

	@ManyToOne(optional = false)
	private Language language;

	@ManyToMany
	@JoinTable(
		name = "article_tag",
		joinColumns = @JoinColumn(name = "article_id"),
		inverseJoinColumns = @JoinColumn(name = "tag_id")
	)
	private Set<Tag> tags = new HashSet<>();

	@ManyToMany
	@JoinTable(
		name = "article_image",
		joinColumns = @JoinColumn(name = "article_id"),
		inverseJoinColumns = @JoinColumn(name = "image_id")
	)
	private Set<Image> images = new HashSet<>();

}
