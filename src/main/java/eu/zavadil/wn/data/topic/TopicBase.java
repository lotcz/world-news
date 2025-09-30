package eu.zavadil.wn.data.topic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.wn.data.ProcessingState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PreUpdate;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class TopicBase extends EntityWithNameBase {

	@JsonProperty("isLocked")
	private boolean isLocked = false;

	@JsonProperty("isToast")
	private boolean isToast = false;

	private Instant publishDate;

	@JsonIgnore
	public boolean isPublished() {
		return this.publishDate != null;
	}

	@JsonProperty("mainImageIsIllustrative")
	private boolean mainImageIsIllustrative = true;

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

	/**
	 * Ensures that lastUpdatedOn is updated in the memory on every update
	 */
	@PreUpdate
	public void freshLastUpdatedOn() {
		this.setLastUpdatedOn(Instant.now());
	}
}
