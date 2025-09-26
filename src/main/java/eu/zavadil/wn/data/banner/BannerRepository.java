package eu.zavadil.wn.data.banner;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BannerRepository extends EntityRepository<Banner> {

	@Query("""
				select t
				from Banner t
				where t.name LIKE %:search%
		""")
	Page<Banner> search(@Param("search") String search, PageRequest pr);

	@Query("""
			select b
			from Banner b
			where b.website.id = :websiteId
		""")
	Page<Banner> loadByWebsiteId(int websiteId, PageRequest pr);

}
