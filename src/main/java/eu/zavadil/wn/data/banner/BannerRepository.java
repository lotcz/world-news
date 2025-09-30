package eu.zavadil.wn.data.banner;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface BannerRepository extends EntityRepository<Banner> {

	@Query("""
				select b
				from Banner b
				where b.name ILIKE %:search%
					or b.contentHtml ILIKE %:search%
		""")
	Page<Banner> search(@Param("search") String search, Pageable pr);

	@Query("""
			select b
			from Banner b
			where b.website.id = :websiteId
		""")
	Page<Banner> loadByWebsiteId(@Param("websiteId") int websiteId, Pageable pr);

	@Query("""
			select b
			from Banner b
			where b.website.id = :websiteId
				and b.lastUpdatedOn > :lastUpdatedOn
		""")
	Page<Banner> loadBannersForImportFromLastUpdated(
		@Param("websiteId") int websiteId,
		@Param("lastUpdatedOn") Instant lastUpdatedOn,
		Pageable pr
	);

	default Page<Banner> loadBannersForImport(int websiteId, Instant lastUpdatedOn, int size) {
		PageRequest pr = PageRequest.of(0, size, Sort.by("lastUpdatedOn"));
		return lastUpdatedOn == null ? this.loadByWebsiteId(websiteId, pr)
			: this.loadBannersForImportFromLastUpdated(websiteId, lastUpdatedOn, pr);
	}
}
