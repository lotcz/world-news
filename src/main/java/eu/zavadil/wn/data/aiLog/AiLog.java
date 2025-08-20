package eu.zavadil.wn.data.aiLog;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.wn.data.AiOperation;
import eu.zavadil.wn.data.EntityType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

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

	private Double temperature;

	private static final int MODEL_SIZE = 100;

	@Column(length = MODEL_SIZE)
	@Size(max = MODEL_SIZE)
	private String model;
	
	@Column(columnDefinition = "TEXT")
	private String response;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private EntityType entityType;

	private Integer entityId;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private AiOperation operation;

}
