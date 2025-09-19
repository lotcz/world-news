package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.ai.embeddings.data.TopicEmbeddingDistance;
import eu.zavadil.wn.data.topic.Topic;
import eu.zavadil.wn.data.topic.TopicStub;
import eu.zavadil.wn.service.TopicService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/topics")
@Tag(name = "Topics")
@Slf4j
public class TopicController {

	@Autowired
	TopicService topicService;

	@GetMapping("")
	public JsonPage<Topic> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.topicService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public TopicStub insert(@RequestBody TopicStub document) {
		document.setId(null);
		return this.topicService.save(document);
	}

	@GetMapping("{id}")
	public TopicStub load(@PathVariable int id) {
		return this.topicService.loadById(id);
	}

	@PutMapping("{id}")
	public TopicStub update(@PathVariable int id, @RequestBody TopicStub document) {
		document.setId(id);
		return this.topicService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.topicService.deleteById(id);
	}

	@GetMapping("by-realm/{realmId}")
	public JsonPage<Topic> loadByRealm(
		@PathVariable int realmId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			this.topicService.loadByRealm(realmId, PagingUtils.of(page, size, sorting))
		);
	}

	@GetMapping("similar-to-topic/{topicId}")
	public List<TopicEmbeddingDistance> loadSimilarToTopic(
		@PathVariable int topicId,
		@RequestParam(defaultValue = "10") int size
	) {
		return this.topicService.findSimilar(topicId, size);
	}

	@GetMapping("similar-to-article/{articleId}")
	public List<TopicEmbeddingDistance> loadSimilarToArticle(
		@PathVariable int articleId,
		@RequestParam(defaultValue = "10") int size
	) {
		return this.topicService.findSimilarToArticle(articleId, size);
	}

	@GetMapping("similar-to-realm/{realmId}")
	public List<TopicEmbeddingDistance> loadSimilarToRealm(
		@PathVariable int realmId,
		@RequestParam(defaultValue = "10") int size
	) {
		return this.topicService.findSimilarToRealm(realmId, size);
	}
}
