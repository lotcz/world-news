package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.data.realm.RealmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RealmService extends RepositoryNamedLookupCache<Realm> {

	@Autowired
	public RealmService(RealmRepository repository) {
		super(repository, Realm::new);
	}

}
