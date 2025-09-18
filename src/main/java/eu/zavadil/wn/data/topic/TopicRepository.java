package eu.zavadil.wn.data.topic;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface TopicRepository extends EntityRepository<Topic> {

	@Query("""
			select t
			from Topic t
			where t.name LIKE %:search%
		""")
	Page<Topic> search(@Param("search") String search, PageRequest pr);

	Page<Topic> findAllByRealmId(int realmId, PageRequest pr);

	@Query("""
			select t
			from Topic t
			where t.processingState = 'Waiting'
				and t.articleCountExternal > 1
				and t.isLocked = false
		""")
	Page<Topic> loadCompilationQueue(PageRequest pr);

	@Query("""
			select t
			from Topic t
			where t.realm is null
				and t.processingState = 'Done'
				and t.articleCountInternal > 0
				and t.isLocked = false
		""")
	Page<Topic> loadCategorizationQueue(PageRequest pr);

	/**
	 * topics cleanup
	 */
	Page<Topic> findAllByArticleCountAndLastUpdatedOnBefore(
		int articleCount,
		Instant before,
		PageRequest pr
	);

}
