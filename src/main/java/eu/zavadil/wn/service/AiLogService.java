package eu.zavadil.wn.service;

import eu.zavadil.wn.ai.assistant.AiAssistantParams;
import eu.zavadil.wn.data.aiLog.AiLog;
import eu.zavadil.wn.data.aiLog.AiLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiLogService {

	@Autowired
	AiLogRepository aiLogRepository;

	public AiLog log(AiLog log) {
		return this.aiLogRepository.save(log);
	}

	public AiLog log(String systemPrompt, String userPrompt, double temperature, String model, String response) {
		AiLog log = new AiLog();
		log.setSystemPrompt(systemPrompt);
		log.setUserPrompt(userPrompt);
		log.setTemperature(temperature);
		log.setResponse(response);
		log.setModel(model);
		return this.log(log);
	}

	public AiLog log(AiAssistantParams params, String response) {
		return this.log(
			params.getSystemPromptString(),
			params.getUserPromptString(),
			params.getTemperature(),
			params.getModel(),
			response
		);
	}
}
