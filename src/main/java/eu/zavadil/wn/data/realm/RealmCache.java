package eu.zavadil.wn.data.realm;

import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RealmCache extends RepositoryNamedLookupCache<Realm> {

	@Autowired
	public RealmCache(RealmRepository repository) {
		super(repository, Realm::new);
	}

}
