package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.banner.Banner;
import eu.zavadil.wn.data.banner.BannerStub;
import eu.zavadil.wn.service.BannerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/banners")
@Tag(name = "Banners")
@Slf4j
public class BannerController {

	@Autowired
	BannerService bannerService;

	@GetMapping("")
	public JsonPage<Banner> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.bannerService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public BannerStub insert(@RequestBody BannerStub document) {
		document.setId(null);
		return this.bannerService.save(document);
	}

	@GetMapping("{id}")
	public BannerStub load(@PathVariable int id) {
		return this.bannerService.requireById(id);
	}

	@PutMapping("{id}")
	public BannerStub update(@PathVariable int id, @RequestBody BannerStub document) {
		document.setId(id);
		return this.bannerService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.bannerService.deleteById(id);
	}

	@GetMapping("by-website/{websiteId}")
	public JsonPage<Banner> loadPagedByWebsite(
		@PathVariable int websiteId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.bannerService.loadByWebsiteId(websiteId, PagingUtils.of(page, size, sorting)));
	}

}
