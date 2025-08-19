package eu.zavadil.wn.ai.embeddings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiEmbeddingsResponse {

	private List<Double> result = new ArrayList<>();

}
