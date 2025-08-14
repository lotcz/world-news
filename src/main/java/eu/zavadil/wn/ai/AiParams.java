package eu.zavadil.wn.ai;

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
public class AiParams {

	/**
	 * 0 - exact, 1 - freestyle
	 */
	private double temperature = 0.5;

	private List<String> systemPrompt = new ArrayList<>();

	private List<String> userPrompt = new ArrayList<>();

	public String getSystemPromptString() {
		return String.join("\r\n", this.systemPrompt);
	}

	public String getUserPromptString() {
		return String.join("\r\n", this.userPrompt);
	}

}
