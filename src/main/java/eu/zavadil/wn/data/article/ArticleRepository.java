package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.wn.data.ProcessingState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends EntityRepository<Article> {

	@Query("""
			select a
			from Article a
			where lower(a.title) LIKE %:search%
				or lower(a.originalUrl) LIKE %:search%
				or lower(a.originalUid) LIKE %:search%
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

	Optional<Article> findFirstByOriginalUrl(String originalUrl);

	Optional<Article> findFirstByOriginalUid(String originalUid);

	Page<Article> findAllByProcessingStateOrderByLastUpdatedOnAsc(ProcessingState state, PageRequest pr);

	Page<Article> findAllByProcessingStateAndLastUpdatedOnLessThanOrderByLastUpdatedOnAsc(
		ProcessingState state,
		Instant lastUpdatedOn,
		PageRequest pr
	);

}
