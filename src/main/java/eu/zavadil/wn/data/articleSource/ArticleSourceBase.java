package eu.zavadil.wn.data.articleSource;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.wn.data.ImportType;
import eu.zavadil.wn.data.ProcessingState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ArticleSourceBase extends EntityWithNameBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ProcessingState processingState = ProcessingState.NotReady;

	private static final int URL_SIZE = 255;

	@Column(length = URL_SIZE)
	@Size(max = URL_SIZE)
	private String url;

	public void setUrl(String url) {
		this.url = this.truncateString(url, URL_SIZE);
	}

	@Column(nullable = false)
	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ImportType importType;

	private Instant lastImported;

	/**
	 * Prohibited words/sentences delimited by new line.
	 */
	@Column(columnDefinition = "TEXT")
	private String filterOut;

	@Column(updatable = false, insertable = false)
	private int articleCount = 0;
}
