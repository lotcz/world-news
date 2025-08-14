package eu.zavadil.wn.ai.chatgpt;

import lombok.Data;

import java.util.List;

@Data
public class ChatGptResponse {

	private List<ChatGptChoice> choices;

}
