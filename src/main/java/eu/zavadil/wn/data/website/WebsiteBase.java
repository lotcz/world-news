package eu.zavadil.wn.data.website;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;

@Slf4j
@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class WebsiteBase extends EntityWithNameBase {

	private static final int URL_SIZE = 255;

	@Column(length = URL_SIZE)
	@Size(max = URL_SIZE)
	private String url;

	public void setOriginalUrl(String url) {
		this.url = this.truncateString(url, URL_SIZE);
	}

	@Column(columnDefinition = "TEXT")
	private String description;

	private static final int TOKEN_SIZE = 255;

	@Column(length = TOKEN_SIZE)
	@Size(max = TOKEN_SIZE)
	private String secretImportToken;

	private boolean useSsl;

	private Instant importLastStarted;

	private Instant importLastHeartbeat;

	private Instant importLastArticleUpdatedOn;

	private Instant importLastBannerUpdatedOn;

}
