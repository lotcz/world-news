package eu.zavadil.wn.data.country;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;

public interface CountryRepository extends EntityRepository<Country> {

	@Query("""
				select c
				from Realm c
				where lower(c.name) LIKE %:search%
		""")
	Page<Country> search(String search, PageRequest pr);
}
