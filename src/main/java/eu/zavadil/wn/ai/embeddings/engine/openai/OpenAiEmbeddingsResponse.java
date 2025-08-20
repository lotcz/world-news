package eu.zavadil.wn.ai.embeddings.engine.openai;

import lombok.Data;

import java.util.List;

@Data
public class OpenAiEmbeddingsResponse {

	private List<OpenAiEmbeddingsResult> data;

}
