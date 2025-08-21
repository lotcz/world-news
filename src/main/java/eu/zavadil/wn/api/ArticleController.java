package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.article.ArticleStub;
import eu.zavadil.wn.service.ArticleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

	@PostMapping("")
	public ArticleStub insert(@RequestBody ArticleStub document) {
		document.setId(null);
		return this.articleService.save(document);
	}

	@GetMapping("{id}")
	public ArticleStub load(@PathVariable int id) {
		return this.articleService.loadById(id);
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

}
