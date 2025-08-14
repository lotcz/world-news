package eu.zavadil.wn.data.aiLog;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.wn.data.AiOperation;
import eu.zavadil.wn.data.EntityType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	indexes = {
		@Index(columnList = "createdOn"),
		@Index(columnList = "entityType, entityId, createdOn"),
		@Index(columnList = "operation, createdOn")
	}
)
public class AiLog extends EntityBase {

	@Column(columnDefinition = "TEXT")
	private String systemPrompt;

	@Column(columnDefinition = "TEXT")
	private String userPrompt;

	private double temperature;

	@Column(columnDefinition = "TEXT")
	private String response;

	private EntityType entityType;

	private int entityId;

	private AiOperation operation;

}
