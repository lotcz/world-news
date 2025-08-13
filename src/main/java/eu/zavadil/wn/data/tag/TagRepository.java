package eu.zavadil.wn.data.tag;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;

public interface TagRepository extends EntityRepository<Tag> {

	@Query("""
				select r
				from Language r
				where lower(r.name) LIKE %:search%
		""")
	Page<Tag> search(String search, PageRequest pr);
}
