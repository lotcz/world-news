package eu.zavadil.wn.data.topic;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.wn.data.ProcessingState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TopicRepository extends EntityRepository<Topic> {

	@Query("""
				select t
				from Topic t
				where lower(t.name) LIKE %:search%
		""")
	Page<Topic> search(@Param("search") String search, PageRequest pr);

	Page<Topic> findAllByProcessingStateAndArticleCountGreaterThan(ProcessingState processingState, int minArticleCount, PageRequest pr);

}
