package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryLookupTableCache;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.data.articleSource.ArticleSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticleSourceService extends RepositoryLookupTableCache<ArticleSource> {

	@Autowired
	public ArticleSourceService(ArticleSourceRepository repository) {
		super(repository, ArticleSource::new);
	}

}
