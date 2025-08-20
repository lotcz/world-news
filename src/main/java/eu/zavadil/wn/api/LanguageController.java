package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.language.Language;
import eu.zavadil.wn.service.LanguageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/languages")
@Tag(name = "Languages")
@Slf4j
public class LanguageController {

	@Autowired
	LanguageService languageService;

	@GetMapping("all")
	public List<Language> loadAll() {
		return this.languageService.all();
	}

	@GetMapping("")
	public JsonPage<Language> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.languageService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public Language insert(@RequestBody Language document) {
		document.setId(null);
		return this.languageService.set(document);
	}

	@GetMapping("{id}")
	public Language load(@PathVariable int id) {
		return this.languageService.get(id);
	}

	@PutMapping("{id}")
	public Language update(@PathVariable int id, @RequestBody Language document) {
		document.setId(id);
		return this.languageService.set(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.languageService.deleteById(id);
	}

}
