package eu.zavadil.wn.data.image;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;

public interface ImageRepository extends EntityRepository<Image> {

	@Query("""
			select r
			from Language r
			where lower(r.name) LIKE %:search%
		""")
	Page<Image> search(String search, PageRequest pr);
}
