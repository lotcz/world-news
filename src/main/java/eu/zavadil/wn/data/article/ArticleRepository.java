package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArticleRepository extends EntityRepository<Article> {

	@Query("""
				select a
				from Article a
				where lower(a.title) LIKE %:search%
		""")
	Page<Article> search(@Param("search") String search, PageRequest pr);

}
