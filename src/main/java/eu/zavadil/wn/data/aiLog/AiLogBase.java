package eu.zavadil.wn.data.aiLog;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.wn.data.AiOperation;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class AiLogBase extends EntityBase {

	@Column(columnDefinition = "TEXT")
	private String systemPrompt;

	@Column(columnDefinition = "TEXT")
	private String userPrompt;

	@Column(columnDefinition = "TEXT")
	private String response;

	private AiOperation operation;

}
