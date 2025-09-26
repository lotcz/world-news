package eu.zavadil.wn.api;

import eu.zavadil.java.util.EnumUtils;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.articleSource.ImportType;
import eu.zavadil.wn.data.banner.BannerType;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/enumerations")
@Tag(name = "Enumerations")
@Slf4j
public class EnumerationsController {

	@GetMapping("import-type")
	public List<String> importTypes() {
		return EnumUtils.namesOf(ImportType.class);
	}

	@GetMapping("banner-type")
	public List<String> bannerTypes() {
		return EnumUtils.namesOf(BannerType.class);
	}

	@GetMapping("processing-state")
	public List<String> processingStates() {
		return EnumUtils.namesOf(ProcessingState.class);
	}

}
