package eu.zavadil.wn.service;

import eu.zavadil.wn.ai.assistant.AiAssistantParams;
import eu.zavadil.wn.data.aiLog.AiLog;
import eu.zavadil.wn.data.aiLog.AiLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AiLogService {

	@Autowired
	AiLogRepository aiLogRepository;

	public Page<AiLog> filter(Instant fromDate, Instant toDate, PageRequest pr) {
		return (fromDate == null && toDate == null) ? this.aiLogRepository.findAll(pr)
			: this.aiLogRepository.filter(fromDate, toDate, pr);
	}

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
