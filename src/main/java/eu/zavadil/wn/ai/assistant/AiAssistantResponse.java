package eu.zavadil.wn.ai.assistant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiAssistantResponse {

	@Builder.Default
	private boolean isError = false;

	private String response;

	private int inputTokens;

	private int outputTokens;

}
