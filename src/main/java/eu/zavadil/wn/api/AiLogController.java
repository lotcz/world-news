package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.wn.data.EntityType;
import eu.zavadil.wn.data.aiLog.AiLog;
import eu.zavadil.wn.service.AiLogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

	@GetMapping("by-entity/{entityType}/{entityId}")
	public JsonPage<AiLog> loadByEntity(
		@PathVariable EntityType entityType,
		@PathVariable int entityId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.aiLogService.loadByEntity(entityType, entityId, PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("{id}")
	public AiLog loadSingle(@PathVariable int id) {
		return this.aiLogService.loadSingle(id);
	}
	
}
