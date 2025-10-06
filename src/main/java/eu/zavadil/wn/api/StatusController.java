package eu.zavadil.wn.api;

import eu.zavadil.java.oauth.common.payload.ServerOAuthInfoPayload;
import eu.zavadil.wn.stats.StatsService;
import eu.zavadil.wn.stats.WnStats;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}/status")
@Tag(name = "Status")
@Slf4j
public class StatusController {

	@Value("${app.version}")
	String version;

	@Value("${oauth.self-name}")
	String appName;

	@Value("${oauth.url}")
	String oauthUrl;

	@Autowired
	StatsService statsService;

	@GetMapping("version")
	@Operation(summary = "App version.")
	public String version() {
		return this.version;
	}

	@GetMapping("stats")
	@Operation(summary = "App stats.")
	public WnStats stats() {
		return this.statsService.getStats();
	}

	@GetMapping("oauth/info")
	@Operation(summary = "Get server oauth info.")
	public ServerOAuthInfoPayload info() {
		return new ServerOAuthInfoPayload(
			this.oauthUrl,
			this.appName,
			this.version()
		);
	}

}
