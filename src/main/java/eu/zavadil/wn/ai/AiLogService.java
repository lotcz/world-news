package eu.zavadil.wn.ai;

import eu.zavadil.wn.ai.assistant.AiAssistantParams;
import eu.zavadil.wn.ai.assistant.AiAssistantResponse;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsParams;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsResponse;
import eu.zavadil.wn.ai.images.AiImageParams;
import eu.zavadil.wn.ai.images.AiImageResponse;
import eu.zavadil.wn.data.aiLog.AiOperation;
import eu.zavadil.wn.data.aiLog.EntityType;
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

	public Page<AiLog> loadByEntity(EntityType entityType, int entityId, PageRequest pr) {
		return this.aiLogRepository.findAllByEntityTypeAndEntityId(entityType, entityId, pr);
	}

	public AiLog loadSingle(int id) {
		return this.aiLogRepository.findById(id).orElse(null);
	}

	public AiLog log(AiLog log) {
		return this.aiLogRepository.save(log);
	}

	public AiLog log(
		AiAssistantParams params,
		AiAssistantResponse response,
		AiOperation operation,
		EntityType entityType,
		Integer entityId
	) {
		return this.log(
			AiLog.builder()
				.systemPrompt(params.getSystemPromptString())
				.userPrompt(params.getUserPromptString())
				.temperature(params.getTemperature())
				.model(params.getModel())
				.operation(operation)
				.entityType(entityType)
				.entityId(entityId)
				.response(response.getResponse())
				.inputTokens((int) response.getInputTokens())
				.outputTokens((int) response.getOutputTokens())
				.requestProcessingTimeNs(response.getProcessingTimeNs())
				.build()
		);
	}

	public AiLog log(
		AiEmbeddingsParams params,
		AiEmbeddingsResponse response,
		EntityType entityType,
		Integer entityId
	) {
		return this.log(
			AiLog.builder()
				.userPrompt(params.getText())
				.model(params.getModel())
				.operation(AiOperation.GetEmbeddings)
				.entityType(entityType)
				.entityId(entityId)
				.response(response.getResult().toString())
				.inputTokens((int) response.getInputTokens())
				.requestProcessingTimeNs(response.getProcessingTimeNs())
				.build()
		);
	}

	public AiLog log(
		AiImageParams params,
		AiImageResponse response,
		EntityType entityType,
		Integer entityId
	) {
		return this.log(
			AiLog.builder()
				.systemPrompt(params.getSystemPromptString())
				.userPrompt(params.getUserPromptString())
				.model(params.getModel())
				.operation(AiOperation.GenerateImage)
				.entityType(entityType)
				.entityId(entityId)
				.response(response.getResponse())
				.inputTokens((int) response.getInputTokens())
				.requestProcessingTimeNs(response.getProcessingTimeNs())
				.build()
		);
	}
}
