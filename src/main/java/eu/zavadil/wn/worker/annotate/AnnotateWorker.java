package eu.zavadil.wn.worker.annotate;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.service.AiAssistantService;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.TagService;
import eu.zavadil.wn.service.TopicService;
import eu.zavadil.wn.util.WnUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class AnnotateWorker extends SmartQueueProcessorBase<Article> implements AnnotateQueueProcessor {

	@Autowired
	ArticleService articleService;

	@Autowired
	TopicService topicService;

	@Autowired
	TagService tagService;

	@Autowired
	AiAssistantService aiAssistantService;

	List<String> systemPrompt = List.of(
		"Jsi redaktor v online časopise, který zpracovává články a jiné zpravodajské texty.",
		"Odpovídej vždy přesně ve formě čistého textu."
	);

	List<String> createTitleUserPrompt = List.of(
		"Vymysli titulek pro následující článek:"
	);

	List<String> createSummaryUserPrompt = List.of(
		"Zkrať na jeden odstavec shrnující nejdůležitější informace v textu:"
	);

	List<String> findTagsUserPrompt = List.of(
		"Najdi nejdůležitější klíčová slova a vypíš je v 1. pádu oddělené čárkou.",
		"Stačí jen pět těch opravdu nejdůležitějších - budou použity jako tagy pro kategorizaci obsahu."
	);

	@Autowired
	public AnnotateWorker(AnnotateArticleQueue queue) {
		super(queue);
	}

	private String cleanResponse(String response) {
		return StringUtils.blankToNull(
			WnUtil.removeWrappingQuotes(
				WnUtil.removeWrappingAsterisks(
					WnUtil.removeWrappingQuotes(
						WnUtil.normalizeAndClean(response)
					)
				)
			)
		);
	}

	private void updateTitle(Article article) {
		if (StringUtils.notBlank(article.getTitle())) return;

		if (StringUtils.isBlank(article.getBody())) {
			throw new RuntimeException(
				String.format("Article %s has no body! Cannot update title.", article.toString())
			);
		}

		List<String> userPrompt = new ArrayList<>(this.createTitleUserPrompt);
		userPrompt.add(article.getBody());

		String response = this.aiAssistantService.ask(this.systemPrompt, userPrompt);
		article.setTitle(this.cleanResponse(response));
	}

	private void updateSummary(Article article) {
		if (StringUtils.notBlank(article.getSummary())) return;

		if (StringUtils.isBlank(article.getTitle())) {
			throw new RuntimeException(
				String.format("Article %s has no title! Cannot update summary.", article.toString())
			);
		}

		if (StringUtils.isBlank(article.getBody())) {
			throw new RuntimeException(
				String.format("Article %s has no body! Cannot update summary.", article.toString())
			);
		}

		List<String> userPrompt = new ArrayList<>(this.createSummaryUserPrompt);
		userPrompt.add(article.getTitle());
		userPrompt.add(article.getBody());

		String response = this.aiAssistantService.ask(this.systemPrompt, userPrompt);
		article.setSummary(this.cleanResponse(response));
	}

	private void updateTags(Article article) {
		if (!article.getTags().isEmpty()) return;

		if (StringUtils.isBlank(article.getTitle())) {
			throw new RuntimeException(
				String.format("Article %s has no title! Cannot update tags.", article.toString())
			);
		}

		if (StringUtils.isBlank(article.getSummary())) {
			throw new RuntimeException(
				String.format("Article %s has no summary! Cannot update tags.", article.toString())
			);
		}

		List<String> userPrompt = new ArrayList<>(this.findTagsUserPrompt);
		userPrompt.add(article.getTitle());
		userPrompt.add(article.getSummary());

		String response = this.aiAssistantService.ask(this.systemPrompt, userPrompt);
		List<String> words = StringUtils.safeSplit(response, ",");

		for (String raw : words) {
			String word = WnUtil.removeWrappingQuotes(StringUtils.safeTrim(raw));
			if (StringUtils.notBlank(word)) {
				Tag tag = this.tagService.obtain(word);
				article.getTags().add(tag);
			}
		}
	}

	private Embedding updateEmbedding(Article article) {
		Set<Tag> tags = article.getTags();
		if (tags.isEmpty()) {
			throw new RuntimeException(
				String.format("Article %s has no tags! Cannot detect topic.", article.toString())
			);
		}

		if (StringUtils.isBlank(article.getTitle())) {
			throw new RuntimeException(
				String.format("Article %s has no title! Cannot create embedding.", article.toString())
			);
		}

		if (StringUtils.isBlank(article.getBody())) {
			throw new RuntimeException(
				String.format("Article %s has no body! Cannot create embedding.", article.toString())
			);
		}

		return this.articleService.updateEmbedding(article);
	}

	private Topic assignTopic(Article article, Embedding embedding) {
		if (article.getTopic() != null && article.isInternal()) return null;

		// todo: narrow search by searching by tags

		Topic mostSimilar = this.topicService.findMostSimilar(embedding);

		if (mostSimilar == null) {
			mostSimilar = new Topic();
			mostSimilar.setName(article.getTitle());
			mostSimilar.setSummary(article.getSummary());
			mostSimilar.setLanguage(article.getLanguage());
		}

		// save topic, but don't mark it ready for compilation until article is not saved
		mostSimilar.setProcessingState(ProcessingState.NotReady);
		this.topicService.save(mostSimilar);

		article.setTopic(mostSimilar);
		return mostSimilar;
	}

	public void annotateArticle(Article article) {
		article.setProcessingState(ProcessingState.Processing);
		this.articleService.save(article);

		Topic topic = null;

		this.updateTitle(article);
		this.updateSummary(article);
		this.updateTags(article);

		Embedding embedding = this.updateEmbedding(article);
		if (article.isInternal()) {
			if (article.getPublishDate() == null) {
				article.setPublishDate(Instant.now());
			}
		} else {
			topic = this.assignTopic(article, embedding);
		}

		article.setProcessingState(ProcessingState.Done);
		this.articleService.save(article);

		if (topic != null) {
			// if topic was assigned, mark it for compilation now
			topic.setProcessingState(ProcessingState.Waiting);
			this.topicService.save(topic);
		}
	}

	@Override
	public void processItem(Article a) {
		try {
			this.annotateArticle(a);
		} catch (Exception e) {
			log.error("Article annotation failed: {}", a, e);
		}
	}
}
