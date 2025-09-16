package eu.zavadil.wn.data.topic;

import eu.zavadil.wn.data.image.Image;
import eu.zavadil.wn.data.realm.Realm;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Topic extends TopicBase {

	@ManyToOne
	private Realm realm;

	@ManyToOne
	private Image image;

	@ManyToMany
	@JoinTable(
		name = "topic_image",
		joinColumns = @JoinColumn(name = "topic_id"),
		inverseJoinColumns = @JoinColumn(name = "image_id")
	)
	private Set<Image> images = new HashSet<>();

}
