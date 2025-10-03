package eu.zavadil.wn.data.article;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.util.HashUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.ProcessingState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;

@Slf4j
@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ArticleBase extends EntityBase {

	@JsonProperty("isLocked")
	private boolean isLocked = false;

	@Column(nullable = false)
	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ArticleType articleType = ArticleType.Normal;

	@JsonProperty("mainImageIsIllustrative")
	private boolean mainImageIsIllustrative = true;

	private static final int UID_SIZE = 255;

	@Column(length = UID_SIZE)
	@Size(max = UID_SIZE)
	private String uid;

	public static String sanitizeUid(String uid) {
		if (StringUtils.isBlank(uid)) {
			return null;
		}
		if (uid.length() > UID_SIZE) {
			log.warn("Uid {} is longer than max size {}, hashing...", uid, UID_SIZE);
			return HashUtils.hashMd5(uid);
		}
		return uid;
	}

	public void setUid(String uid) {
		this.uid = ArticleBase.sanitizeUid(uid);
	}

	private static final int TITLE_SIZE = 255;

	@Column(length = TITLE_SIZE)
	@Size(max = TITLE_SIZE)
	private String title;

	public void setTitle(String title) {
		this.title = this.truncateString(title, TITLE_SIZE);
	}

	private Instant publishDate;

	@JsonIgnore
	public boolean isPublished() {
		return this.publishDate != null;
	}

	private static final int URL_SIZE = 255;

	@Column(length = URL_SIZE)
	@Size(max = URL_SIZE)
	private String originalUrl;

	public static String sanitizeUrl(String url) {
		url = StringUtils.safeTrim(url);
		if (StringUtils.isBlank(url)) {
			return null;
		}
		if (url.length() > URL_SIZE) {
			url = StringUtils.safeSplit(url, "\\?").get(0);
		}
		if (url.length() > URL_SIZE) {
			log.error("Url still longer than {} chars even after truncation: {}", URL_SIZE, url);
			return StringUtils.safeTruncate(url, URL_SIZE);
		}
		return url;
	}

	public void setOriginalUrl(String url) {
		this.originalUrl = ArticleBase.sanitizeUrl(url);
	}

	@Column(columnDefinition = "TEXT")
	private String summary;

	@Column(columnDefinition = "TEXT")
	private String body;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ProcessingState processingState = ProcessingState.NotReady;

}
