package eu.zavadil.wn.ai.images.openai;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.images.ImageGenerateParams;
import com.openai.models.images.ImageModel;
import com.openai.models.images.ImagesResponse;
import eu.zavadil.java.caching.Lazy;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.ai.images.AiImageParams;
import eu.zavadil.wn.ai.images.AiImageResponse;
import eu.zavadil.wn.ai.images.AiImageResponseType;
import eu.zavadil.wn.ai.images.AiImagesEngine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Primary
public class OpenAiImages implements AiImagesEngine {

	@Value("${chatgpt.apikey}")
	String apiKey;

	private final Lazy<OpenAIClient> openAIClient;

	public OpenAiImages() {
		this.openAIClient = new Lazy<>(
			() -> OpenAIOkHttpClient
				.builder()
				.apiKey(this.apiKey)
				.build()
		);
	}

	@Override
	public AiImageResponse generate(AiImageParams params) {
		List<String> prompt = new ArrayList<>();
		prompt.addAll(params.getSystemPrompt());
		prompt.addAll(params.getUserPrompt());

		ImageGenerateParams.Builder request = ImageGenerateParams
			.builder()
			.model(ImageModel.of(params.getModel()))
			.n(1)
			.background(ImageGenerateParams.Background.OPAQUE)
			.outputFormat(ImageGenerateParams.OutputFormat.of(params.getFormat().toString().toLowerCase()))
			.moderation(ImageGenerateParams.Moderation.LOW)
			.prompt(StringUtils.linesToText(prompt));

		// only available for DALL-E
		//request.responseFormat(ImageGenerateParams.ResponseFormat.B64_JSON);

		long start = System.nanoTime();

		ImagesResponse response = this.openAIClient
			.get()
			.images()
			.generate(request.build());

		long elapsed = System.nanoTime() - start;

		return AiImageResponse
			.builder()
			.response(response.data().orElseThrow().get(0).b64Json().orElseThrow())
			.inputTokens(response.usage().orElseThrow().inputTokens())
			.outputTokens(response.usage().orElseThrow().outputTokens())
			.responseType(AiImageResponseType.Base64)
			.processingTimeNs(elapsed)
			.build();
	}

}
