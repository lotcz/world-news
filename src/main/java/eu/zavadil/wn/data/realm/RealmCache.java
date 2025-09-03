package eu.zavadil.wn.data.realm;

import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RealmCache extends RepositoryNamedLookupCache<Realm> {

	@Autowired
	public RealmCache(RealmRepository repository) {
		super(repository, Realm::new);
	}

	public List<Integer> pathToRoot(Realm realm) {
		List<Integer> result = new ArrayList<>();
		Integer parentId = realm.getParentId();
		while (parentId != null) {
			Realm parent = this.get(parentId);
			result.add(parent.getId());
			parentId = parent.getParentId();
		}
		return result;
	}

	public void preventCircle(Realm updatedRealm) {
		if (updatedRealm.getId() == null || updatedRealm.getParentId() == null) return;
		List<Integer> path = this.pathToRoot(updatedRealm);
		if (path.contains(updatedRealm.getId())) throw new RuntimeException("Realms form a circle!");
	}

	@Override
	public Realm set(Realm realm) {
		this.preventCircle(realm);
		return super.set(realm);
	}
}
