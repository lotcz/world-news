package eu.zavadil.wn.data.website;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WebsiteRepository extends EntityRepository<Website> {

	@Query("""
			select w
			from Website w
			where w.name LIKE %:search%
		""")
	Page<Website> search(@Param("search") String search, PageRequest pr);

	Page<Website> findAllByLanguageId(@Param("languageId") int languageId, PageRequest pr);


}
