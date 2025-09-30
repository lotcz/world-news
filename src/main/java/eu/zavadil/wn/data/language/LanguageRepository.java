package eu.zavadil.wn.data.language;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface LanguageRepository extends EntityRepository<Language> {

	@Query("""
				select l
				from Language l
				where lower(l.name) LIKE %:search%
		""")
	Page<Language> search(String search, Pageable pr);
}
