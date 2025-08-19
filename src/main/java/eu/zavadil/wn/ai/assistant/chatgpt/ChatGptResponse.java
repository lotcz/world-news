package eu.zavadil.wn.ai.assistant.chatgpt;

import lombok.Data;

import java.util.List;

@Data
public class ChatGptResponse {

	private List<ChatGptChoice> choices;

}
