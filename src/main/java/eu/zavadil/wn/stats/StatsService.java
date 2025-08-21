package eu.zavadil.wn.stats;

import eu.zavadil.wn.service.ArticleSourceService;
import eu.zavadil.wn.service.LanguageService;
import eu.zavadil.wn.service.RealmService;
import eu.zavadil.wn.worker.compile.CompileQueueProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

	@Autowired
	RealmService realmService;

	@Autowired
	LanguageService languageService;

	@Autowired
	ArticleSourceService articleSourceService;

	@Autowired
	CompileQueueProcessor compileWorker;

	public WnStats getStats() {
		final WnStats stats = new WnStats();

		// cache
		stats.setRealmCache(this.realmService.getStats());
		stats.setLanguageCache(this.languageService.getStats());
		stats.setArticleSourceCache(this.articleSourceService.getStats());

		// queue
		stats.setCompileQueue(this.compileWorker.getStats());

		return stats;
	}
}
