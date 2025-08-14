package eu.zavadil.wn.ai.chatgpt;

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

}
