package eu.zavadil.wn.stats;

import eu.zavadil.wn.service.RealmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

	@Autowired
	RealmService realmService;

	public WnStats getStats() {
		final WnStats stats = new WnStats();

		// cache
		stats.setRealmCache(this.realmService.getStats());

		return stats;
	}
}
