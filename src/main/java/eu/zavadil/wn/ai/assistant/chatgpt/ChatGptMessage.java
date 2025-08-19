package eu.zavadil.wn.ai.assistant.chatgpt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatGptMessage {

	private String role;

	private String content;
}
