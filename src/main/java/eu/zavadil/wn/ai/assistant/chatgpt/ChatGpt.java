package eu.zavadil.wn.ai.assistant.chatgpt;

import eu.zavadil.java.spring.common.client.HttpApiClientBase;
import eu.zavadil.wn.ai.assistant.AiAssistantEngine;
import eu.zavadil.wn.ai.assistant.AiAssistantParams;
import eu.zavadil.wn.ai.assistant.AiAssistantResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatGpt extends HttpApiClientBase implements AiAssistantEngine {

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

	public AiAssistantResponse ask(AiAssistantParams params) {
		List<ChatGptMessage> messages = new ArrayList<>();
		params.getSystemPrompt().forEach(sp -> messages.add(new ChatGptMessage("system", sp)));
		params.getUserPrompt().forEach(up -> messages.add(new ChatGptMessage("user", up)));

		ChatGptRequest request = ChatGptRequest.builder()
			.responseFormat(new ChatGptResponseFormat("text"))
			.maxTokens(10000)
			.temperature(params.getTemperature() * 2)
			.model(params.getModel())
			.messages(messages)
			.build();

		ChatGptResponse response = this.exchange(HttpMethod.POST, "", request, ChatGptResponse.class);

		String responseText = response.getChoices().get(0).getMessage().getContent();

		return AiAssistantResponse
			.builder()
			.response(responseText)
			.build();
	}
}
