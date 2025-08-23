package eu.zavadil.wn.service;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.java.spring.common.entity.cache.RepositoryLookupTableCache;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.ImportType;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.data.articleSource.ArticleSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleSourceService extends RepositoryLookupTableCache<ArticleSource> {

	private final LanguageService languageService;

	private Lazy<ArticleSource> internalArticleSource;

	@Autowired
	public ArticleSourceService(
		ArticleSourceRepository repository,
		LanguageService languageService
	) {
		super(repository);
		this.languageService = languageService;
		this.internalArticleSource = new Lazy<>(
			() -> this.all()
				.stream()
				.filter(ars -> ars.getImportType() == ImportType.Internal)
				.findFirst()
				.orElseGet(
					() -> {
						ArticleSource articleSource = new ArticleSource();
						articleSource.setName("Internal");
						articleSource.setImportType(ImportType.Internal);
						articleSource.setLanguage(this.languageService.getDefaultLanguage());
						return this.set(articleSource);
					}
				)
		);
	}

	public Page<ArticleSource> search(String search, PageRequest pr) {
		List<ArticleSource> filtered = StringUtils.isBlank(search) ? this.all()
			: this.all().stream().filter(
			(item) -> StringUtils.safeContains(item.getName(), search) || StringUtils.safeContains(item.getUrl(), search)
		).toList();
		return PagingUtils.getPage(filtered, pr);
	}

	public ArticleSource getInternalArticleSource() {
		return this.internalArticleSource.get();
	}

}
