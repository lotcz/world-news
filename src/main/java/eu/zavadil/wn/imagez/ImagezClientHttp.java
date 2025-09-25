package eu.zavadil.wn.imagez;

import eu.zavadil.java.UrlBuilder;
import eu.zavadil.java.spring.common.client.HttpApiClientBase;
import eu.zavadil.java.util.HashUtils;
import eu.zavadil.java.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class ImagezClientHttp extends HttpApiClientBase implements ImagezSmartApi {

	private String secretToken;

	public ImagezClientHttp(
		@Value("${imagez.baseUrl}") String baseUrl,
		@Value("${imagez.secretToken}") String secretToken
	) {
		super(String.format("%s/images", baseUrl));
		this.secretToken = secretToken;
	}

	@Override
	public ImageHealthPayload getHealth(String name) {
		return this.get(String.format("health/%s", name), ImageHealthPayload.class);
	}

	@Override
	public ImageHealthPayload upload(String fileName, byte[] fileBytes) {
		ByteArrayResource resource = new ByteArrayResource(fileBytes) {
			@Override
			public String getFilename() {
				return fileName;
			}
		};

		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("image", resource);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);

		HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

		RestTemplate restTemplate = new RestTemplate();
		Map<String, String> params = new HashMap<>();
		params.put("token", this.secretToken);
		String url = this.getUrl("upload", params);

		ResponseEntity<ImageHealthPayload> response = restTemplate.postForEntity(url, requestEntity, ImageHealthPayload.class);
		return response.getBody();
	}

	@Override
	public ImageHealthPayload uploadFromUrl(String url) {
		return this.post(
			"upload-url",
			new UrlBuilder()
				.addQuery("url", url)
				.addQuery("token", this.secretToken)
				.getQueryParams(),
			ImageHealthPayload.class
		);
	}

	@Override
	public URL getImageUrlOriginal(String name) {
		return UrlBuilder.of(this.baseUrl).addPath("original").addPath(name).build();
	}

	@Override
	public URL getImageUrlResized(String name, ResizeRequest resizeRequest) {
		UrlBuilder builder = UrlBuilder
			.of(this.baseUrl)
			.addPath("resized")
			.addPath(name)
			.addQuery("width", resizeRequest.getWidth())
			.addQuery("height", resizeRequest.getHeight())
			.addQuery("type", resizeRequest.getType());
		String tokenRaw = String.format(
			"%s-%s-%d-%d-%s",
			this.secretToken,
			name,
			resizeRequest.getWidth(),
			resizeRequest.getHeight(),
			resizeRequest.getType()
		);
		if (StringUtils.notBlank(resizeRequest.getExt())) {
			builder.addQuery("ext", resizeRequest.getExt());
			tokenRaw = String.format("%s-%s", tokenRaw, resizeRequest.getExt());
		}
		String token = HashUtils.crc32Hex(tokenRaw);
		return builder.addQuery("token", token).build();
	}

	public void deleteOriginal(String name) {
		this.delete(
			String.format("original/%s", name),
			new UrlBuilder()
				.addQuery("token", this.secretToken)
				.getQueryParams()
		);
	}
}
