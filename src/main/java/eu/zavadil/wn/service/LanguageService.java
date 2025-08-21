package eu.zavadil.wn.service;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.language.Language;
import eu.zavadil.wn.data.language.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LanguageService extends RepositoryNamedLookupCache<Language> {

	private final String defaultLanguageCode;

	private final String defaultLanguageName;

	private final Lazy<Language> defaultLanguage;

	@Autowired
	public LanguageService(
		LanguageRepository repository,
		@Value("${default.language.code}") String defaultLanguageCode,
		@Value("${default.language.name}") String defaultLanguageName
	) {
		super(repository, Language::new);
		this.defaultLanguageCode = defaultLanguageCode;
		this.defaultLanguageName = defaultLanguageName;
		this.defaultLanguage = new Lazy<>(
			() -> this.all()
				.stream()
				.filter(ars -> StringUtils.safeEquals(ars.getCode(), this.defaultLanguageCode))
				.findFirst()
				.orElseGet(
					() -> {
						Language language = new Language();
						language.setName(this.defaultLanguageName);
						language.setCode(this.defaultLanguageCode);
						return this.set(language);
					}
				)
		);
	}

	public Language getDefaultLanguage() {
		return this.defaultLanguage.get();
	}

}
