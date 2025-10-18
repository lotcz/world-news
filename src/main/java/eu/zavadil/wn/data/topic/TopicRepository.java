package eu.zavadil.wn.data.topic;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface TopicRepository extends EntityRepository<Topic> {

	@Query("""
			select t
			from Topic t
			where t.name ILIKE %:search%
				or t.summary ILIKE %:search%
		""")
	Page<Topic> search(@Param("search") String search, Pageable pr);

	@Query("""
			select t
			from Topic t
			where t.publishDate is not null
		""")
	Page<Topic> loadPublished(Pageable pr);

	@Query("""
			select t
			from Topic t
			where t.publishDate is not null
				and (
					t.name ILIKE %:search%
					or t.summary ILIKE %:search%
				)
		""")
	Page<Topic> searchPublished(@Param("search") String search, Pageable pr);

	Page<Topic> findAllByRealmId(int realmId, Pageable pr);

	@Query("""
			select t
			from Topic t
			where t.processingState = 'Waiting'
				and t.externalArticlesSourceCount > 1
				and t.isLocked = false
				and t.articleType != 'Toast'
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
			where t.processingState = 'NotReady'
				and t.publishDate is null
				and t.externalArticlesSourceCount > 1
				and t.externalArticlesUnusedCount > 1
				and t.realm.publishDate is not null
		""")
	Page<Topic> loadApprovalQueue(Pageable pr);

	@Query("""
			select count(t)
			from Topic t
			where t.processingState = 'NotReady'
				and t.publishDate is null
				and t.externalArticlesSourceCount > 1
				and t.externalArticlesUnusedCount > 1
				and t.realm.publishDate is not null
		""")
	int loadApprovalQueueSize();

	@Query("""
			select t
			from Topic t
			where t.processingState = 'Done'
				and t.mainImage is null
				and t.publishDate is not null
				and t.articleType != 'Toast'
				and t.articleCountInternal > 0
		""")
	Page<Topic> loadImageSupplyQueue(Pageable pr);

	@Query("""
			select count(t)
			from Topic t
			where t.processingState = 'Done'
				and t.mainImage is null
				and t.publishDate is not null
				and t.articleType != 'Toast'
				and t.articleCountInternal > 0
		""")
	int loadImageSupplyQueueSize();

}
