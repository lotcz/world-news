package eu.zavadil.wn.data.topic;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.wn.data.ProcessingState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface TopicRepository extends EntityRepository<Topic> {

	@Query("""
			select t
			from Topic t
			where t.name LIKE %:search%
		""")
	Page<Topic> search(@Param("search") String search, Pageable pr);

	Page<Topic> findAllByRealmId(int realmId, Pageable pr);

	@Query("""
			select t
			from Topic t
			where t.processingState = 'Waiting'
				and t.articleCountExternal > 1
				and t.isLocked = false
		""")
	Page<Topic> loadCompilationQueue(Pageable pr);

	@Query("""
			select t
			from Topic t
			where t.realm is null
				and t.processingState = 'Done'
				and t.articleCountInternal > 0
				and t.isLocked = false
		""")
	Page<Topic> loadCategorizationQueue(Pageable pr);

	/**
	 * topics cleanup
	 */
	Page<Topic> findAllByArticleCountAndLastUpdatedOnBefore(
		int articleCount,
		Instant before,
		Pageable pr
	);

	@Query("""
			select t
			from Topic t
			where t.processingState = :processingState
				and t.mainImage is null
				and t.publishDate is not null
				and t.isToast = false
				and t.articleCountInternal > 0
		""")
	Page<Topic> loadImageSupplyQueueInternal(ProcessingState processingState, Pageable pr);

	default Page<Topic> loadImageSupplyQueue(int size) {
		return this.loadImageSupplyQueueInternal(
			ProcessingState.Done,
			PageRequest.of(0, size, Sort.by("publishDate"))
		);
	}

}
