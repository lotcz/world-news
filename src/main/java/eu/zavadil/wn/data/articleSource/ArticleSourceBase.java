package eu.zavadil.wn.data.articleSource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.java.util.StringUtils;
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
import java.util.List;

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
	 * Prohibited words/sentences (one per line)
	 */
	@Column(columnDefinition = "TEXT")
	private String filterOutText;

	@JsonIgnore
	public List<String> getFilterOutLines() {
		return StringUtils.textToLines(this.getFilterOutText());
	}

	/**
	 * scraping of article body will be limited to this element
	 */
	private String limitToElement;

	/**
	 * scraping of article body will exclude these elements (one per line)
	 */
	@Column(columnDefinition = "TEXT")
	private String excludeElements;

	@JsonIgnore
	public List<String> getExcludeElementsLines() {
		return StringUtils.textToLines(this.getExcludeElements());
	}

	@Column(updatable = false, insertable = false)
	private int articleCount = 0;

}
