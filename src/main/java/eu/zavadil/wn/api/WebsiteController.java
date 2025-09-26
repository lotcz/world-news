package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.website.Website;
import eu.zavadil.wn.service.WebsiteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/websites")
@Tag(name = "Websites")
@Slf4j
public class WebsiteController {

	@Autowired
	WebsiteService websiteService;

	@GetMapping("all")
	public List<Website> loadAll() {
		return this.websiteService.all();
	}

	@GetMapping("")
	public JsonPage<Website> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.websiteService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public Website insert(@RequestBody Website document) {
		document.setId(null);
		return this.websiteService.save(document);
	}

	@GetMapping("{id}")
	public Website load(@PathVariable int id) {
		return this.websiteService.get(id);
	}

	@PutMapping("{id}")
	public Website update(@PathVariable int id, @RequestBody Website document) {
		document.setId(id);
		return this.websiteService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.websiteService.deleteById(id);
	}

}
