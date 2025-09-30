package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.wn.data.article.Article;
import eu.zavadil.wn.data.banner.Banner;
import eu.zavadil.wn.data.website.Website;
import eu.zavadil.wn.service.ArticleService;
import eu.zavadil.wn.service.BannerService;
import eu.zavadil.wn.service.WebsiteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("${api.base-url}/import")
@Tag(name = "Import")
@Slf4j
public class ImportController {

	@Autowired
	WebsiteService websiteService;

	@Autowired
	ArticleService articleService;

	@Autowired
	BannerService bannerService;

	@Data
	public static class HeartbeatPayload {
		private Instant importStartedOn;
		private Instant lastUpdatedOn;
	}

	// ARTICLES

	@GetMapping("articles/by-website/{websiteUrl}")
	public JsonPage<Article> loadArticlesByWebsite(
		@PathVariable String websiteUrl,
		@RequestParam(defaultValue = "10") int size
	) {
		Website website = this.websiteService.requireByUrl(websiteUrl);
		return JsonPageImpl.of(
			this.articleService.loadArticlesForWebsiteImport(website, size)
		);
	}

	@PutMapping("articles/heartbeat/{websiteUrl}")
	public void articlesHeartbeat(
		@PathVariable String websiteUrl,
		@RequestBody HeartbeatPayload payload
	) {
		Website website = this.websiteService.requireByUrl(websiteUrl);
		website.setImportLastHeartbeat(Instant.now());
		if (payload.getImportStartedOn() != null) {
			website.setImportLastStarted(payload.getImportStartedOn());
		}
		if (payload.getLastUpdatedOn() != null) {
			website.setImportLastArticleUpdatedOn(payload.getLastUpdatedOn());
		}
		this.websiteService.save(website);
	}

	// BANNERS

	@GetMapping("banners/by-website/{websiteUrl}")
	public JsonPage<Banner> loadBannersByWebsite(
		@PathVariable String websiteUrl,
		@RequestParam(defaultValue = "10") int size
	) {
		Website website = this.websiteService.requireByUrl(websiteUrl);
		return JsonPageImpl.of(
			this.bannerService.loadBannersForWebsiteImport(website, size)
		);
	}

	@PutMapping("banners/heartbeat/{websiteUrl}")
	public void bannersHeartbeat(
		@PathVariable String websiteUrl,
		@RequestBody HeartbeatPayload payload
	) {
		Website website = this.websiteService.requireByUrl(websiteUrl);
		website.setImportLastHeartbeat(Instant.now());
		if (payload.getImportStartedOn() != null) {
			website.setImportLastStarted(payload.getImportStartedOn());
		}
		if (payload.getLastUpdatedOn() != null) {
			website.setImportLastBannerUpdatedOn(payload.getLastUpdatedOn());
		}
		this.websiteService.save(website);
	}

}
