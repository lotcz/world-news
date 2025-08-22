package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.wn.data.ProcessingState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ArticleRepository extends EntityRepository<Article> {

	@Query("""
			select a
			from Article a
			where lower(a.title) LIKE %:search%
		""")
	Page<Article> search(@Param("search") String search, PageRequest pr);

	Page<Article> findAllByTopicId(@Param("topicId") int topicId, PageRequest pr);

	Optional<Article> findFirstByOriginalUrl(String originalUrl);

	Page<Article> findAllByProcessingStateOrderByLastUpdatedOnAsc(ProcessingState state, PageRequest pr);

}
