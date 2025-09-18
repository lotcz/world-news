package eu.zavadil.wn.ai.assistant;

import eu.zavadil.wn.ai.AiLogService;
import eu.zavadil.wn.data.AiOperation;
import eu.zavadil.wn.data.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiAssistantService {

	@Autowired
	AiAssistantEngine aiEngine;

	@Autowired
	AiLogService aiLogService;

	public String ask(
		AiAssistantParams params,
		AiOperation operation,
		EntityType entityType,
		Integer entityId
	) {
		AiAssistantResponse response = this.aiEngine.ask(params);
		this.aiLogService.log(params, response, operation, entityType, entityId);
		return response.getResponse();
	}

	public String ask(
		List<String> systemPrompt,
		List<String> userPrompt,
		AiOperation operation,
		EntityType entityType,
		Integer entityId
	) {
		return this.ask(
			AiAssistantParams
				.builder()
				.systemPrompt(systemPrompt)
				.userPrompt(userPrompt)
				.build(),
			operation,
			entityType,
			entityId
		);
	}

}
