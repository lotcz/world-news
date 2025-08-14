package eu.zavadil.wn.ai.chatgpt;

import eu.zavadil.java.spring.common.client.HttpApiClientBase;
import eu.zavadil.wn.ai.AiEngine;
import eu.zavadil.wn.ai.AiParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatGpt extends HttpApiClientBase implements AiEngine {

	String model = "gpt-4o-mini";

	@Value("${chatgpt.apikey}")
	String apiKey;

	public ChatGpt() {
		super("https://api.openai.com/v1/chat/completions");
	}

	@Override
	public HttpHeaders getHttpHeaders(String path) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");
		headers.add("Authorization", String.format("Bearer %s", this.apiKey));
		return headers;
	}

	public String ask(AiParams params) {
		List<ChatGptMessage> messages = new ArrayList<>();
		params.getSystemPrompt().forEach(sp -> messages.add(new ChatGptMessage("system", sp)));
		params.getUserPrompt().forEach(up -> messages.add(new ChatGptMessage("user", up)));

		ChatGptRequest request = ChatGptRequest.builder()
			.maxTokens(2000)
			.temperature(params.getTemperature() * 2)
			.model(this.model)
			.messages(messages)
			.build();

		ChatGptResponse response = this.exchange(HttpMethod.POST, "", request, ChatGptResponse.class);

		return response.getChoices().get(0).getMessage().getContent();
	}
}
