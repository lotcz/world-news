package eu.zavadil.wn.data.topic;

import eu.zavadil.wn.data.language.Language;
import eu.zavadil.wn.data.realm.Realm;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Topic extends TopicBase {

	@ManyToOne
	private Realm realm;

	@ManyToOne(optional = false)
	private Language language;

}
