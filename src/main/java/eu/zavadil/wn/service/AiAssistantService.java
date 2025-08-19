package eu.zavadil.wn.service;

import eu.zavadil.wn.ai.assistant.AiAssistantEngine;
import eu.zavadil.wn.ai.assistant.AiAssistantParams;
import eu.zavadil.wn.ai.assistant.AiAssistantResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiAssistantService {

	@Autowired
	AiAssistantEngine aiEngine;

	@Autowired
	AiLogService aiLogService;

	public String ask(AiAssistantParams params) {
		AiAssistantResponse response = this.aiEngine.ask(params);
		this.aiLogService.log(params, response.getResponse());
		return response.getResponse();
	}

	public String ask(List<String> systemPrompt, List<String> userPrompt, int temperature) {
		return this.ask(
			AiAssistantParams
				.builder()
				.temperature(temperature)
				.systemPrompt(systemPrompt)
				.userPrompt(userPrompt)
				.build()
		);
	}

	public String ask(List<String> systemPrompt, List<String> userPrompt) {
		return this.ask(
			AiAssistantParams
				.builder()
				.systemPrompt(systemPrompt)
				.userPrompt(userPrompt)
				.build()
		);
	}

	public String ask(String systemPrompt, String userPrompt) {
		return this.ask(List.of(systemPrompt), List.of(userPrompt));
	}

}
