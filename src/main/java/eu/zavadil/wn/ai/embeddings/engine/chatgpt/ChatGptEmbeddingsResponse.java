package eu.zavadil.wn.ai.embeddings.engine.chatgpt;

import lombok.Data;

import java.util.List;

@Data
public class ChatGptEmbeddingsResponse {

	private List<ChatGptEmbeddingsResult> data;

}
