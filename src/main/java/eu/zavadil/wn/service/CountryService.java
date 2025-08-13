package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryLookupTableCache;
import eu.zavadil.wn.data.country.Country;
import eu.zavadil.wn.data.country.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CountryService extends RepositoryLookupTableCache<Country> {

	@Autowired
	public CountryService(CountryRepository repository) {
		super(repository, Country::new);
	}

}
