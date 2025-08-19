package eu.zavadil.wn.ai.embeddings.openai;

import lombok.Data;

import java.util.List;

@Data
public class OpenAiEmbeddingsResult {

	private List<Double> embedding;

}
