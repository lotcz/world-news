package eu.zavadil.wn.data.image;

import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Image extends EntityBase {

	@JsonProperty("isAiGenerated")
	private boolean isAiGenerated = false;

	@Column(columnDefinition = "TEXT")
	private String originalUrl;

	private static final int NAME_SIZE = 255;

	@Column(length = NAME_SIZE)
	@Size(max = NAME_SIZE)
	private String name;

	private String description;

	private static final int AUTHOR_SIZE = 100;

	@Column(length = AUTHOR_SIZE)
	@Size(max = AUTHOR_SIZE)
	private String author;

	public void setAuthor(String value) {
		this.author = this.truncateString(value, AUTHOR_SIZE);
	}

	@Column(columnDefinition = "TEXT")
	private String authorUrl;

	private static final int SOURCE_SIZE = 100;

	@Column(length = SOURCE_SIZE)
	@Size(max = SOURCE_SIZE)
	private String source;

	public void setSource(String value) {
		this.source = this.truncateString(value, SOURCE_SIZE);
	}

	@Column(columnDefinition = "TEXT")
	private String sourceUrl;

	private static final int LICENSE_SIZE = 100;

	@Column(length = LICENSE_SIZE)
	@Size(max = LICENSE_SIZE)
	private String license;

	public void setLicense(String value) {
		this.license = this.truncateString(value, LICENSE_SIZE);
	}

	private Integer originalWidth;

	private Integer originalHeight;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private VerticalAlign verticalAlign;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private HorizontalAlign horizontalAlign;
}
