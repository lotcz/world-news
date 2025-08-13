package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.country.Country;
import eu.zavadil.wn.service.CountryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/country")
@Tag(name = "Country")
@Slf4j
public class CountryController {

	@Autowired
	CountryService countryService;

	@GetMapping("all")
	public List<Country> loadAll() {
		return this.countryService.all();
	}

	@GetMapping("")
	public JsonPage<Country> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.countryService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public Country insert(@RequestBody Country document) {
		document.setId(null);
		return this.countryService.save(document);
	}

	@GetMapping("{id}")
	public Country load(@PathVariable int id) {
		return this.countryService.get(id);
	}

	@PutMapping("{id}")
	public Country update(@PathVariable int id, @RequestBody Country document) {
		document.setId(id);
		return this.countryService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.countryService.deleteById(id);
	}

}
