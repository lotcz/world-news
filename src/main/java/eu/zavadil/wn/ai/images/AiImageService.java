package eu.zavadil.wn.ai.images;

import eu.zavadil.wn.ai.AiLogService;
import eu.zavadil.wn.data.aiLog.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiImageService {

	@Autowired
	AiImagesEngine aiEngine;

	@Autowired
	AiLogService aiLogService;

	public AiImageResponse generate(AiImageParams params, EntityType entityType, Integer entityId) {
		AiImageResponse response = this.aiEngine.generate(params);
		this.aiLogService.log(params, response, entityType, entityId);
		return response;
	}

	public AiImageResponse generate(
		List<String> systemPrompt,
		List<String> userPrompt,
		EntityType entityType,
		Integer entityId
	) {
		return this.generate(
			AiImageParams
				.builder()
				.systemPrompt(systemPrompt)
				.userPrompt(userPrompt)
				.build(),
			entityType,
			entityId
		);
	}

}
