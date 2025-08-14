package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.service.RealmService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/realm")
@Tag(name = "Realm")
@Slf4j
public class RealmController {

	@Autowired
	RealmService realmService;

	@GetMapping("all")
	public List<Realm> loadAll() {
		return this.realmService.all();
	}

	@GetMapping("")
	public JsonPage<Realm> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.realmService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public Realm insert(@RequestBody Realm document) {
		document.setId(null);
		return this.realmService.set(document);
	}

	@GetMapping("{id}")
	public Realm load(@PathVariable int id) {
		return this.realmService.get(id);
	}

	@PutMapping("{id}")
	public Realm update(@PathVariable int id, @RequestBody Realm document) {
		document.setId(id);
		return this.realmService.set(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.realmService.deleteById(id);
	}

}
