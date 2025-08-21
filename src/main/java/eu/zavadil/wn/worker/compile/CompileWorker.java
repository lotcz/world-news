package eu.zavadil.wn.worker.compile;

import eu.zavadil.java.spring.common.queues.SmartQueueProcessorBase;
import eu.zavadil.wn.data.ImportType;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
		"Jsi redaktor v online časopise, který píše články a jiné zpravodajské texty."
	);

	List<String> compileUserPrompt = List.of(
		"Zde je několik článků na stejné téma. Napiš vlastními slovy úplně nový článek jejich sloučením.",
		"Výsledný článek musí pokrývat všechny klíčové informace obsažené ve zdrojových článcích, ale používat vlastní formulace a vypadat jako úplně nový."
	);

	public void compile(Topic topic) {
		Page<Article> articles = this.articleService.loadByTopicId(topic.getId(), PageRequest.of(0, topic.getArticleCount()));

		Article compiled = articles.stream()
			.filter(
				a -> a.getSource().getImportType().equals(ImportType.Internal)
			)
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
			if (!article.getSource().getImportType().equals(ImportType.Internal)) {
				compiled.getTags().addAll(article.getTags());
				userPrompt.add(article.getBody());
			}
		}

		String response = this.aiAssistantService.ask(this.systemPrompt, userPrompt);
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
		this.compile(t);
	}

}
