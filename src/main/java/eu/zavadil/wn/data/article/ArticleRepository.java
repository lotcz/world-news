package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.wn.data.ProcessingState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends EntityRepository<Article> {

	@Query("""
			select a
			from Article a
			where a.title ILIKE %:search%
				or a.summary ILIKE %:search%
				or a.originalUrl LIKE %:search%
				or a.uid LIKE %:search%
		""")
	Page<Article> search(@Param("search") String search, Pageable pr);

	Page<Article> findAllBySourceId(@Param("sourceId") int sourceId, Pageable pr);

	@Query("""
			select a
			from Article a
			join ArticleTagStub ats on (a.id = ats.id.articleId)
			where ats.id.tagId = :tagId
		""")
	Page<Article> loadByTagId(int tagId, Pageable pr);

	Optional<Article> findFirstBySourceIdAndUid(int sourceId, String uid);

	List<Article> findAllByTopicId(@Param("topicId") int topicId);

	Page<Article> findAllByTopicId(@Param("topicId") int topicId, Pageable pr);

	@Query("""
			select a
			from Article a
			where a.topic.id = :topicId
				and a.source.importType = 'Internal'
		""")
	Page<Article> loadInternalByTopicId(int topicId, Pageable pr);

	@Query("""
			select a
			from Article a
			where a.topic.id = :topicId
				and a.source.importType <> 'Internal'
		""")
	Page<Article> loadExternalByTopicId(int topicId, Pageable pr);

	// MARK AS CHANGED

	@Modifying
	@Query("""
		update Article a
		set a.lastUpdatedOn = :lastUpdatedOn
		where a.topic.id = :topicId
			and a.source.importType = 'Internal'
		""")
	void markInternalArticlesUnsafe(@Param("topicId") int topicId, Instant lastUpdatedOn);

	/**
	 * Set lastUpdatedOn on all internal articles to trigger redownload
	 */
	@Modifying
	default void markInternalArticles(int topicId, Instant lastUpdatedOn) {
		this.markInternalArticlesUnsafe(topicId, lastUpdatedOn == null ? Instant.now() : lastUpdatedOn);
	}

	// QUEUES

	/**
	 * stuck articles
	 */
	Page<Article> findAllByProcessingStateAndLastUpdatedOnLessThanOrderByLastUpdatedOnAsc(
		ProcessingState state,
		Instant lastUpdatedOn,
		Pageable pr
	);

	@Query("""
			select a
			from Article a
			where a.processingState = 'Waiting'
		""")
	Page<Article> loadAnnotationQueue(Pageable pr);

	// IMPORT

	@Query("""
			select a
			from Article a
			join a.topic t
			where a.processingState = 'Done'
				and a.source.id = :articleSourceId
				and t.realm.id in :realmIds
		""")
	Page<Article> loadArticlesForImportAll(
		@Param("articleSourceId") int articleSourceId,
		@Param("realmIds") List<Integer> realmIds,
		Pageable pr
	);

	@Query("""
			select a
			from Article a
			join a.topic t
			where a.processingState = 'Done'
				and a.source.id = :articleSourceId
				and t.realm.id in :realmIds
				and a.lastUpdatedOn > :lastArticleUpdatedOn
		""")
	Page<Article> loadArticlesForImportFromLastUpdated(
		@Param("articleSourceId") int articleSourceId,
		@Param("realmIds") List<Integer> realmIds,
		@Param("lastArticleUpdatedOn") Instant lastArticleUpdatedOn,
		Pageable pr
	);

	default Page<Article> loadArticlesForImport(
		int articleSourceId,
		List<Integer> realmIds,
		Instant lastArticleUpdatedOn,
		int size
	) {
		PageRequest pr = PageRequest.of(0, size, Sort.by("lastUpdatedOn"));
		return lastArticleUpdatedOn == null ? this.loadArticlesForImportAll(articleSourceId, realmIds, pr)
			: this.loadArticlesForImportFromLastUpdated(articleSourceId, realmIds, lastArticleUpdatedOn, pr);
	}

}
