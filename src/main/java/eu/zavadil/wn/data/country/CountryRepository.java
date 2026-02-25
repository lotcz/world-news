package eu.zavadil.wn.data.country;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CountryRepository extends EntityRepository<Country> {

	@Query("""
				select c
				from Country c
				where c.name ILIKE %:search%
		""")
	Page<Country> search(@Param("search") String search, Pageable pr);

	@Query("""
			select c
			from Country c
			where c.createOverview = true
		""")
	Page<Country> loadCountriesForOverview(Pageable pr);

}
