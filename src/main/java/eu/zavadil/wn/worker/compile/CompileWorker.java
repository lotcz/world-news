package eu.zavadil.wn.worker.compile;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.data.AiOperation;
import eu.zavadil.wn.data.EntityType;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
	public CompileWorker(CompileTopicQueue queue) {
		super(queue);
	}

	List<String> systemPrompt = List.of(
		"Jsi redaktor v online časopise, který píše články a jiné zpravodajské texty.",
		"Odpovídej vždy jen jako čistý text."
	);

	List<String> compileUserPrompt = List.of(
		"Zde je několik článků na stejné téma. Napiš vlastními slovy úplně nový článek jejich sloučením.",
		"Výsledný článek musí pokrývat všechny klíčové informace obsažené ve zdrojových článcích, ale používat vlastní formulace a vypadat jako úplně nový."
	);

	public void compile(Topic topic) {
		topic.setProcessingState(ProcessingState.Processing);
		this.topicService.save(topic);

		List<Article> articles = this.articleService.loadAllByTopicId(topic.getId());

		Article compiled = articles.stream()
			.filter(Article::isInternal)
			.findFirst()
			.orElseGet(
				() -> {
					Article article = new Article();
					article.setTopic(topic);
					article.setLanguage(topic.getLanguage());
					article.setSource(this.articleSourceService.getInternalArticleSource());
					return article;
				}
			);

		List<String> userPrompt = new ArrayList<>(this.compileUserPrompt);
		for (Article article : articles) {
			if (!article.isInternal()) {
				compiled.getTags().addAll(article.getTags());
				userPrompt.add(article.getBody());
			}
		}

		String response = this.aiAssistantService.ask(
			this.systemPrompt,
			userPrompt,
			AiOperation.CompileArticles,
			EntityType.Topic,
			topic.getId()
		);
		compiled.setBody(response);

		compiled.setTitle(null);
		compiled.setSummary(null);
		compiled.setProcessingState(ProcessingState.Waiting);
		this.articleService.save(compiled);

		topic.setProcessingState(ProcessingState.Done);
		this.topicService.save(topic);
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
