package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.wn.data.ProcessingState;
import eu.zavadil.wn.data.articleSource.ImportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends EntityRepository<Article> {

	@Query("""
			select a
			from Article a
			where a.title LIKE %:search%
				or a.originalUrl LIKE %:search%
				or a.uid LIKE %:search%
		""")
	Page<Article> search(@Param("search") String search, PageRequest pr);

	List<Article> findAllByTopicId(@Param("topicId") int topicId);

	Page<Article> findAllByTopicId(@Param("topicId") int topicId, PageRequest pr);

	Page<Article> findAllBySourceId(@Param("sourceId") int sourceId, PageRequest pr);

	@Query("""
			select a
			from Article a
			join ArticleTagStub ats on (a.id = ats.id.articleId)
			where ats.id.tagId = :tagId
		""")
	Page<Article> loadByTagId(int tagId, PageRequest pr);

	Optional<Article> findFirstBySourceIdAndUid(int sourceId, String uid);

	/**
	 * stuck articles
	 */
	Page<Article> findAllByProcessingStateAndLastUpdatedOnLessThanOrderByLastUpdatedOnAsc(
		ProcessingState state,
		Instant lastUpdatedOn,
		PageRequest pr
	);

	@Query("""
			select a
			from Article a
			where a.processingState = 'Waiting'
		""")
	Page<Article> loadAnnotationQueue(PageRequest pr);

	@Query("""
			select a
			from Article a
			where a.processingState = 'Done'
				and a.mainImage is null
				and a.source.id in (select s.id from ArticleSource s where s.importType = :importType)
		""")
	Page<Article> loadImageSupplyQueueInternal(ImportType importType, PageRequest pr);

	/**
	 * Unused - we prefer to assign image to topic
	 */
	default Page<Article> loadImageSupplyQueue(int size) {
		return this.loadImageSupplyQueueInternal(
			ImportType.Internal,
			PageRequest.of(0, size, Sort.by("lastUpdatedOn"))
		);
	}

}
