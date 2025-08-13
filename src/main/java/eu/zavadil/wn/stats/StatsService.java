package eu.zavadil.wn.stats;

import eu.zavadil.wn.service.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

	@Autowired
	CountryService countryService;

	public WnStats getStats() {
		final WnStats stats = new WnStats();

		// cache
		stats.setCountryCache(this.countryService.getStats());

		return stats;
	}
}
