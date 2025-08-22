package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.aiLog.AiLog;
import eu.zavadil.wn.service.AiLogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("${api.base-url}/ai-log")
@Tag(name = "AI Log")
@Slf4j
public class AiLogController {

	@Autowired
	AiLogService aiLogService;

	@GetMapping("")
	public JsonPage<AiLog> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting,
		@RequestParam(defaultValue = "") Instant from,
		@RequestParam(defaultValue = "") Instant to
	) {
		return JsonPageImpl.of(this.aiLogService.filter(from, to, PagingUtils.of(page, size, sorting)));
	}

}
