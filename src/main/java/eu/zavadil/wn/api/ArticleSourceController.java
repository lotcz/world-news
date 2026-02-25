package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.service.ArticleSourceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/article-sources")
@Tag(name = "Article Sources")
@Slf4j
public class ArticleSourceController {

	@Autowired
	ArticleSourceService articleSourceService;

	@GetMapping("all")
	public List<ArticleSource> loadAll() {
		return this.articleSourceService.all();
	}

	@GetMapping("")
	public JsonPage<ArticleSource> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.articleSourceService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public ArticleSource insert(@RequestBody ArticleSource document) {
		document.setId(null);
		return this.articleSourceService.set(document);
	}

	@GetMapping("{id}")
	public ArticleSource load(@PathVariable int id) {
		return this.articleSourceService.get(id);
	}

	@PutMapping("{id}")
	public ArticleSource update(@PathVariable int id, @RequestBody ArticleSource document) {
		document.setId(id);
		return this.articleSourceService.set(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.articleSourceService.deleteById(id);
	}

}
