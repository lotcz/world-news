package eu.zavadil.wn.data.website;

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
public class Website extends WebsiteBase {

	@ManyToOne(optional = false)
	private Language language;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
		name = "website_realm",
		joinColumns = @JoinColumn(name = "website_id"),
		inverseJoinColumns = @JoinColumn(name = "realm_id")
	)
	private Set<Realm> realms = new HashSet<>();

	@Override
	public String toString() {
		return String.format("Website[ID:%d, NAME:%s]", this.getId(), this.getName());
	}
}
