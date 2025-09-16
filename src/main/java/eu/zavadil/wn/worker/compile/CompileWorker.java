package eu.zavadil.wn.worker.compile;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.data.AiOperation;
import eu.zavadil.wn.data.EntityType;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.language.Language;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.*;
import eu.zavadil.wn.worker.annotate.AnnotateWorker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class CompileWorker extends SmartQueueProcessorBase<Topic> implements CompileQueueProcessor {

	@Autowired
	TopicService topicService;

	@Autowired
	ArticleService articleService;

	@Autowired
	ArticleSourceService articleSourceService;

	@Autowired
	TagService tagService;

	@Autowired
	AiAssistantService aiAssistantService;

	@Autowired
	AnnotateWorker annotateWorker;

	@Autowired
	public CompileWorker(CompileTopicQueue queue) {
		super(queue);
	}

	public void compile(Topic topic) {
		topic.setProcessingState(ProcessingState.Processing);
		this.topicService.save(topic);

		Language language = this.articleSourceService.getInternalArticleSource().getLanguage();
		List<Article> articles = this.articleService.loadAllByTopicId(topic.getId());

		Article compiled = articles.stream()
			.filter(Article::isInternal)
			.findFirst()
			.orElseGet(
				() -> {
					Article article = new Article();
					article.setUid(UUID.randomUUID().toString());
					article.setTopic(topic);
					article.setLanguage(language);
					article.setSource(this.articleSourceService.getInternalArticleSource());
					return article;
				}
			);

		List<String> userPrompt = new ArrayList<>(language.getUserPromptCompileArticles());
		for (Article article : articles) {
			if (!article.isInternal()) {
				compiled.getTags().addAll(article.getTags());
				userPrompt.add(article.getBody());
			}
		}

		String response = this.aiAssistantService.ask(
			language.getSystemPrompt(),
			userPrompt,
			AiOperation.CompileArticles,
			EntityType.Topic,
			topic.getId()
		);
		compiled.setBody(response);

		// annotate new article
		compiled.setLanguage(language);
		compiled.setTitle(null);
		compiled.setSummary(null);
		compiled.getTags().clear();
		this.annotateWorker.updateTitle(compiled);
		this.annotateWorker.updateSummary(compiled);
		//this.annotateWorker.updateTags(compiled);
		compiled.setProcessingState(ProcessingState.Done);
		this.articleService.save(compiled);

		// update topic with title and summary from new article
		topic.setName(compiled.getTitle());
		topic.setSummary(compiled.getSummary());

		topic.setProcessingState(ProcessingState.Done);
		this.topicService.save(topic);
	}

	@Override
	public void onBeforeProcessing() {
		//log.info("Starting compilation...");
	}

	@Override
	public void onAfterProcessing() {
		// reset article source cache so article counts can be reloaded
		if (this.getStats().getProcessed() > 0) {
			this.articleSourceService.reset();
		}
		//log.info("Compilation finished");
	}

	@Override
	public void processItem(Topic t) {
		try {
			this.compile(t);
		} catch (Exception e) {
			log.error("Topic compilation failed: {}", t, e);
		}
	}

}
