package eu.zavadil.wn.data.website;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WebsiteRepository extends EntityRepository<Website> {

	@Query("""
			select w
			from Website w
			where w.name ILIKE %:search%
				or w.description ILIKE %:search%
				or w.url ILIKE %:search%
		""")
	Page<Website> search(@Param("search") String search, Pageable pr);

	Page<Website> findAllByLanguageId(@Param("languageId") int languageId, Pageable pr);

}
