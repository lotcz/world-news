package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import eu.zavadil.wn.data.website.Website;
import eu.zavadil.wn.data.website.WebsiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WebsiteService extends RepositoryNamedLookupCache<Website> {

	@Autowired
	public WebsiteService(WebsiteRepository repository) {
		super(repository, Website::new);
	}

	public Website save(Website website) {
		return this.set(website);
	}

	public Website loadById(int id) {
		return this.get(id);
	}

}
