package eu.zavadil.wn.worker.cleanup.synonyms;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * Find synonyms with articles and then assign articles to the main tag instead of the synonym.
 */
@Service
@Slf4j
public class SynonymsCleanupWorker extends SmartQueueProcessorBase<Tag> implements SynonymsCleanupQueueProcessor {

	@Autowired
	ArticleService articleService;

	@Autowired
	TagService tagService;

	@Autowired
	public SynonymsCleanupWorker(SynonymsCleanupQueue queue) {
		super(queue);
	}

	public void cleanup(Tag tag) {
		Tag synonym = this.tagService.desynonymize(tag);
		Page<Article> articles = this.articleService.loadByTagId(tag.getId(), PageRequest.of(0, 10));

		for (Article article : articles) {
			article.getTags().remove(tag);
			article.getTags().add(synonym);
			this.articleService.save(article);
		}
	}

	@Override
	public void processItem(Tag t) {
		try {
			this.cleanup(t);
		} catch (Exception e) {
			log.error("Tag synonym cleanup failed: {}", t, e);
		}
	}

}
