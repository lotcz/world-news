package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.data.tag.TagStub;
import eu.zavadil.wn.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/tags")
@Slf4j
public class TagController {

	@Autowired
	TagService tagService;

	@GetMapping("")
	public JsonPage<Tag> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.tagService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("by-article/{articleId}")
	public List<Tag> loadByArticle(@PathVariable int articleId) {
		return this.tagService.loadByArticleId(articleId);
	}

	@PostMapping("")
	public TagStub insert(@RequestBody TagStub document) {
		document.setId(null);
		return this.tagService.save(document);
	}

	@GetMapping("{id}")
	public TagStub load(@PathVariable int id) {
		return this.tagService.loadById(id);
	}

	@PutMapping("{id}")
	public TagStub update(@PathVariable int id, @RequestBody TagStub document) {
		document.setId(id);
		return this.tagService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.tagService.deleteById(id);
	}

}
