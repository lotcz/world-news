package eu.zavadil.wn.data.topic;

import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.wn.data.ProcessingState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class TopicBase extends EntityWithNameBase {

	@JsonProperty("isLocked")
	private boolean isLocked = false;

	@Column(columnDefinition = "TEXT")
	private String summary;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ProcessingState processingState = ProcessingState.NotReady;

	@Column(updatable = false, insertable = false)
	private int articleCountInternal = 0;

	@Column(updatable = false, insertable = false)
	private int articleCountExternal = 0;

	@Column(updatable = false, insertable = false)
	private int articleCount = 0;
}
