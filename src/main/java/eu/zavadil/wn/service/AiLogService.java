package eu.zavadil.wn.service;

import eu.zavadil.wn.ai.AiParams;
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

	public AiLog log(String systemPrompt, String userPrompt, double temperature, String response) {
		AiLog log = new AiLog();
		log.setSystemPrompt(systemPrompt);
		log.setUserPrompt(userPrompt);
		log.setTemperature(temperature);
		log.setResponse(response);
		return this.log(log);
	}

	public AiLog log(AiParams params, String response) {
		return this.log(params.getSystemPromptString(), params.getUserPromptString(), params.getTemperature(), response);
	}
}
