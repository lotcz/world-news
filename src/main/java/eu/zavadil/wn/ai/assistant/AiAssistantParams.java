package eu.zavadil.wn.ai.assistant;

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
public class AiAssistantParams {

	private List<String> systemPrompt = new ArrayList<>();

	public String getSystemPromptString() {
		return String.join("\r\n", this.systemPrompt);
	}

	private List<String> userPrompt = new ArrayList<>();

	public String getUserPromptString() {
		return String.join("\r\n", this.userPrompt);
	}

	/**
	 * 0 - exact, 1 - freestyle
	 */
	@Builder.Default
	private double temperature = 0.5;

	@Builder.Default
	private String model = "gpt-4o-mini";

	@Builder.Default
	private int maxTokens = 10000;

}
