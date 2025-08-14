package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryLookupTableCache;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.data.articleSource.ArticleSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleSourceService extends RepositoryLookupTableCache<ArticleSource> {

	@Autowired
	public ArticleSourceService(ArticleSourceRepository repository) {
		super(repository);
	}

	public Page<ArticleSource> search(String search, PageRequest pr) {
		List<ArticleSource> filtered = StringUtils.isBlank(search) ? this.all()
			: this.all().stream().filter(
			(item) -> StringUtils.safeContains(item.getName(), search) || StringUtils.safeContains(item.getUrl(), search)
		).toList();
		return PagingUtils.getPage(filtered, pr);
	}

	public ArticleSource getNextImportSource() {
		List<ArticleSource> sources = this.all();
		ArticleSource oldest = null;

		for (ArticleSource ars : sources) {
			if (ars.getLastImported() == null) return ars;
			if (oldest == null || ars.getLastImported().isBefore(oldest.getLastImported())) {
				oldest = ars;
			}
		}

		return oldest;
	}
}
