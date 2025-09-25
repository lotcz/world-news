package eu.zavadil.wn.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.images.AiImageResponse;
import eu.zavadil.wn.ai.images.AiImageResponseType;
import eu.zavadil.wn.ai.images.AiImageService;
import eu.zavadil.wn.cc.CreativeCommons;
import eu.zavadil.wn.cc.ImageSearchResult;
import eu.zavadil.wn.data.EntityType;
import eu.zavadil.wn.data.image.Image;
import eu.zavadil.wn.imagez.ImageHealthPayload;
import eu.zavadil.wn.imagez.ImagezSettingsPayload;
import eu.zavadil.wn.imagez.ImagezSmartApi;
import eu.zavadil.wn.imagez.ResizeRequest;
import eu.zavadil.wn.service.ImageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("${api.base-url}/images")
@Tag(name = "Images")
@Slf4j
public class ImageController {

	@Value("${imagez.baseUrl}")
	String imagezBaseUrl;

	@Value("${imagez.secretToken}")
	String imagezSecretToken;

	@Autowired
	ImagezSmartApi imagez;

	@Autowired
	ImageService imageService;

	@Autowired
	CreativeCommons creativeCommons;

	@Autowired
	AiImageService aiImageService;

	// IMAGE DATA

	@GetMapping("")
	public JsonPage<Image> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.imageService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public Image insert(@RequestBody Image document) {
		document.setId(null);
		return this.imageService.save(document);
	}

	@GetMapping("{id}")
	public Image load(@PathVariable int id) {
		return this.imageService.requireById(id);
	}

	@PutMapping("{id}")
	public Image update(@PathVariable int id, @RequestBody Image document) {
		document.setId(id);
		return this.imageService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.imageService.deleteById(id);
	}

	// IMAGEZ

	@GetMapping("imagez/settings")
	public ImagezSettingsPayload imagezSettings() {
		return new ImagezSettingsPayload(this.imagezBaseUrl, this.imagezSecretToken);
	}

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
		Image image = this.imageService.requireById(id);
		return this.imagez.getImageUrlResized(
			image.getName(),
			new ResizeRequest(type, width, height, ext)
		).toString();
	}

	// CC

	@GetMapping("cc/search")
	public JsonPage<ImageSearchResult> creativeCommonsSearch(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search
	) {
		return JsonPageImpl.of(
			this.creativeCommons.searchImages(search, PageRequest.of(page, size))
		);
	}

	// GENERATE IMAGE

	@PostMapping("generate")
	public ImageHealthPayload generateImage(
		@RequestParam(required = false) EntityType entityType,
		@RequestParam(required = false) Integer entityId,
		@RequestParam(required = false) String systemPrompt,
		@RequestParam String userPrompt
	) {
		AiImageResponse response = this.aiImageService.generate(
			List.of(
				StringUtils.isBlank(systemPrompt)
					? "Generate image for news site to accompany following article:"
					: systemPrompt
			),
			List.of(userPrompt),
			entityType,
			entityId
		);

		if (response.getResponseType() == AiImageResponseType.Base64) {
			String b64 = response.getResponse();
			byte[] imageBytes = Base64.getDecoder().decode(b64);

			return this.imagez.upload(
				String.format(
					"ai-generated-%d.%s",
					Instant.now().getEpochSecond(),
					response.getFormat().toString().toLowerCase()
				),
				imageBytes
			);
		} else {
			return this.imagez.uploadFromUrl(response.getResponse());
		}
	}

}
