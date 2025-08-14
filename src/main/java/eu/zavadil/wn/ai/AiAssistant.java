package eu.zavadil.wn.ai;

import eu.zavadil.wn.data.aiLog.AiLog;
import eu.zavadil.wn.service.AiLogService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiAssistant {

	@Autowired
	AiEngine aiEngine;

	@Autowired
	AiLogService aiLogService;

	@PostConstruct
	public void init() {
		this.ask("You are a helpful assistant.", "Say just \"Hello\"");
	}

	public AiLog ask(AiParams params) {
		String response = this.aiEngine.ask(params);
		return this.aiLogService.log(params, response);
	}

	public AiLog ask(List<String> systemPrompt, List<String> userPrompt, int temperature) {
		return this.ask(new AiParams(temperature, systemPrompt, userPrompt));
	}

	public AiLog ask(List<String> systemPrompt, List<String> userPrompt) {
		return this.ask(
			AiParams.builder()
				.systemPrompt(systemPrompt)
				.userPrompt(userPrompt)
				.build()
		);
	}

	public AiLog ask(String systemPrompt, String userPrompt) {
		return this.ask(List.of(systemPrompt), List.of(userPrompt));
	}

}
