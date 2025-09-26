package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.ai.embeddings.data.ArticleEmbeddingDistance;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.article.ArticleStub;
import eu.zavadil.wn.service.ArticleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/articles")
@Tag(name = "Articles")
@Slf4j
public class ArticleController {

	@Autowired
	ArticleService articleService;

	@GetMapping("")
	public JsonPage<Article> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("by-topic/{topicId}")
	public JsonPage<Article> loadByTopic(
		@PathVariable int topicId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleService.loadByTopicId(topicId, PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("by-source/{sourceId}")
	public JsonPage<Article> loadBySource(
		@PathVariable int sourceId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleService.loadBySourceId(sourceId, PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("by-tag/{tagId}")
	public JsonPage<Article> loadByTag(
		@PathVariable int tagId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleService.loadByTagId(tagId, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public ArticleStub insert(@RequestBody ArticleStub document) {
		document.setId(null);
		return this.articleService.save(document);
	}

	@GetMapping("{id}")
	public ArticleStub load(@PathVariable int id) {
		return this.articleService.requireStubById(id);
	}

	@PutMapping("{id}")
	public ArticleStub update(@PathVariable int id, @RequestBody ArticleStub document) {
		document.setId(id);
		return this.articleService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.articleService.deleteById(id);
	}

	@GetMapping("similar-to-article/{articleId}")
	public List<ArticleEmbeddingDistance> loadSimilarToArticle(
		@PathVariable int articleId,
		@RequestParam(defaultValue = "10") int size
	) {
		return this.articleService.findSimilar(articleId, size);
	}

	@GetMapping("similar-to-topic/{topicId}")
	public List<ArticleEmbeddingDistance> loadSimilarToTopic(
		@PathVariable int topicId,
		@RequestParam(defaultValue = "10") int size
	) {
		return this.articleService.findSimilarToTopic(topicId, size);
	}

}
