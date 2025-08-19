package eu.zavadil.wn.ai.embeddings.openai;

import lombok.Data;

import java.util.List;

@Data
public class OpenAiEmbeddingsResponse {

	private List<OpenAiEmbeddingsResult> data;

}
