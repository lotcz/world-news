package eu.zavadil.wn.imagez;

import eu.zavadil.java.UrlBuilder;
import eu.zavadil.java.spring.common.client.HttpApiClientBase;
import eu.zavadil.java.util.HashUtils;
import eu.zavadil.java.util.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.net.URL;

@Service
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
	public ImageHealthPayload upload(FileInputStream fileStream) {
		return null;
	}

	@Override
	public ImageHealthPayload uploadFromUrl(String url) {
		UrlBuilder builder = UrlBuilder.of("upload-url").addQuery("url", url).addQuery("token", this.secretToken);
		String path = builder.getPathString();
		String query = builder.getQueryString();
		return this.exchange(HttpMethod.POST, String.format("%s?%s", path, query), null, ImageHealthPayload.class);
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
}
