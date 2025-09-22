package eu.zavadil.wn.api;

import eu.zavadil.wn.data.image.Image;
import eu.zavadil.wn.data.image.ImageRepository;
import eu.zavadil.wn.imagez.ImagezSmartApi;
import eu.zavadil.wn.imagez.ResizeRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/images")
@Tag(name = "Images")
@Slf4j
public class ImageController {

	@Autowired
	ImagezSmartApi imagez;

	@Autowired
	ImageRepository imageRepository;

	@GetMapping("imagez/url/resized/by-name/{name}")
	public String imagezUrl(
		@PathVariable String name,
		@RequestParam String type,
		@RequestParam int width,
		@RequestParam int height,
		@RequestParam(defaultValue = "") String ext
	) {
		return this.imagez.getImageUrlResized(
			name,
			new ResizeRequest(type, width, height, ext)
		).toString();
	}

	@GetMapping("imagez/url/resized/by-id/{id}")
	public String imagezUrlById(
		@PathVariable int id,
		@RequestParam String type,
		@RequestParam int width,
		@RequestParam int height,
		@RequestParam(defaultValue = "") String ext
	) {
		Image image = this.imageRepository.findById(id).orElseThrow();
		return this.imagez.getImageUrlResized(
			image.getName(),
			new ResizeRequest(type, width, height, ext)
		).toString();
	}

}
