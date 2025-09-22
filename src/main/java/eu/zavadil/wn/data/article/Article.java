package eu.zavadil.wn.data.article;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.wn.data.ImportType;
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

	@ManyToOne(optional = true)
	private Image mainImage;

	@ManyToMany(fetch = FetchType.EAGER)
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

	@JsonIgnore
	public boolean isInternal() {
		return this.getSource().getImportType().equals(ImportType.Internal);
	}

	@Override
	public String toString() {
		return String.format("Article[ID:%d, TITLE:%s]", this.getId(), this.getTitle());
	}
}
