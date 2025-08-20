package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import eu.zavadil.wn.data.language.Language;
import eu.zavadil.wn.data.language.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LanguageService extends RepositoryNamedLookupCache<Language> {

	@Autowired
	public LanguageService(LanguageRepository repository) {
		super(repository, Language::new);
	}

}
