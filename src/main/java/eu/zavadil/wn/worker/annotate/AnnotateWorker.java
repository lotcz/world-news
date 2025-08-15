package eu.zavadil.wn.worker.annotate;

import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.aiLog.AiLog;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.service.AiService;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class AnnotateWorker {

	@Autowired
	ArticleService articleService;

	@Autowired
	TagService tagService;

	@Autowired
	AiService aiService;

	String systemPrompt = """
			Jsi redaktor v online časopise, který zpracovává zpravodajské texty.
			Vždy najdeš v textu nejdůležitější klíčová slova a vypíšeš je oddělené čárkou.
			Stačí jen pět těch opravdu nejdůležitějších - budou použity jako tagy pro kategorizaci obsahu.
		""";

	String userPrompt = """
			Najdi nejdůležitější klíčová slova:
		""";

	@Scheduled(fixedDelay = 10 * 1000)
	public void execute() {
		List<Article> articles = this.articleService.loadNotReady();
		if (articles.isEmpty()) {
			log.error("No articles need annotation!");
			return;
		}

		int annotated = 0;

		for (Article article : articles) {
			article.setProcessingState(ProcessingState.Processing);
			this.articleService.save(article);

			List<String> systemPrompt = new ArrayList<>();
			systemPrompt.add(this.systemPrompt);
			List<String> userPrompt = new ArrayList<>();
			userPrompt.add(this.userPrompt);
			userPrompt.add(article.getTitle());
			userPrompt.add(article.getSummary());

			AiLog response = this.aiService.ask(systemPrompt, userPrompt);
			List<String> words = StringUtils.safeSplit(response.getResponse(), ",");

			for (String raw : words) {
				String word = StringUtils.safeTrim(raw);
				if (StringUtils.notBlank(word)) {
					Tag tag = this.tagService.obtain(word);
					article.getTags().add(tag);
				}
			}

			article.setProcessingState(ProcessingState.Done);
			this.articleService.save(article);
		}

		log.info("Annotated {} articles.", annotated);
	}
}

