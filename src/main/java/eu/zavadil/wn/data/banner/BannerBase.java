package eu.zavadil.wn.data.banner;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class BannerBase extends EntityWithNameBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private BannerType type = BannerType.Content;

	private String contentHtml;

	private Instant publishDate;
}
