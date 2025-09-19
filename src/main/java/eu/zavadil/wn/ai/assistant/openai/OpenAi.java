package eu.zavadil.wn.ai.assistant.openai;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import eu.zavadil.java.caching.Lazy;
import eu.zavadil.wn.ai.assistant.AiAssistantEngine;
import eu.zavadil.wn.ai.assistant.AiAssistantParams;
import eu.zavadil.wn.ai.assistant.AiAssistantResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class OpenAi implements AiAssistantEngine {

	@Value("${chatgpt.apikey}")
	String apiKey;

	private final Lazy<OpenAIClient> openAIClient;

	public OpenAi() {
		this.openAIClient = new Lazy<>(
			() -> OpenAIOkHttpClient
				.builder()
				.apiKey(this.apiKey)
				.build()
		);
	}

	@Override
	public AiAssistantResponse ask(AiAssistantParams params) {
		ChatCompletionCreateParams.Builder request = ChatCompletionCreateParams
			.builder()
			.model(ChatModel.of(params.getModel()))
			.temperature(params.getTemperature())
			.maxCompletionTokens(params.getMaxTokens());

		params.getSystemPrompt().forEach(request::addSystemMessage);
		params.getUserPrompt().forEach(request::addUserMessage);

		long start = System.nanoTime();

		ChatCompletion response = this.openAIClient
			.get()
			.chat()
			.completions()
			.create(request.build());

		long elapsed = System.nanoTime() - start;

		return AiAssistantResponse
			.builder()
			.response(response.choices().get(0).message().content().orElse(null))
			.inputTokens(response.usage().orElseThrow().promptTokens())
			.outputTokens(response.usage().orElseThrow().completionTokens())
			.processingTimeNs(elapsed)
			.build();
	}

}
