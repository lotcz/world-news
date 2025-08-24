package eu.zavadil.wn.ai.assistant.chatgpt;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChatGptRequest {

	private String model;

	private List<ChatGptMessage> messages;

	@JsonProperty("max_tokens")
	private int maxTokens;

	private double temperature;

	@JsonProperty("response_format")
	private ChatGptResponseFormat responseFormat;
	
}
