package eu.zavadil.wn.api;

import eu.zavadil.wn.imagez.ImagezSmartApi;
import eu.zavadil.wn.imagez.ResizeRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}/images")
@Tag(name = "Images")
@Slf4j
public class ImageController {

	@Autowired
	ImagezSmartApi imagez;

	@GetMapping("imagez/url/resized")
	public String imagezUrl(
		@RequestParam String name,
		@RequestParam String type,
		@RequestParam int width,
		@RequestParam int height,
		@RequestParam(defaultValue = "") String ext
	) {
		return this.imagez.getImageUrlResized(
			name,
			new ResizeRequest(
				type,
				width,
				height,
				ext
			)
		).toString();
	}

}
