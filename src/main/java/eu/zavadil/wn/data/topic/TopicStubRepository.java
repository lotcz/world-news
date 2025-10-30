package eu.zavadil.wn.data.topic;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.wn.data.article.ArticleType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface TopicStubRepository extends EntityRepository<TopicStub> {

	@Modifying
	@Transactional
	@Query("""
		update TopicStub t
		set t.lastUpdatedOn = :lastUpdatedOn
		where t.id = :topicId
		""")
	void markAsChanged(@Param("topicId") int topicId, @Param("lastUpdatedOn") Instant lastUpdatedOn);

	@Modifying
	@Transactional
	default void markAsChanged(int topicId) {
		this.markAsChanged(topicId, Instant.now());
	}

	@Modifying
	@Transactional
	@Query("""
		update TopicStub t
		set t.articleType = :articleType, t.lastUpdatedOn = :lastUpdatedOn
		where t.id = :topicId
		""")
	void changeArticleType(
		@Param("topicId") int topicId,
		@Param("articleType") ArticleType articleType,
		@Param("lastUpdatedOn") Instant lastUpdatedOn
	);

	@Modifying
	@Transactional
	default void changeArticleType(int topicId, ArticleType articleType) {
		this.changeArticleType(topicId, articleType, Instant.now());
	}

	@Modifying
	@Transactional
	@Query("""
		update TopicStub t
		set t.mainImageId = :imageId,
			t.mainImageIsIllustrative = :illustrative,
			t.lastUpdatedOn = :lastUpdatedOn
		where t.id = :topicId
		""")
	void changeImage(
		@Param("topicId") int topicId,
		@Param("imageId") Integer imageId,
		@Param("illustrative") boolean illustrative,
		@Param("lastUpdatedOn") Instant lastUpdatedOn
	);

	@Modifying
	@Transactional
	default void changeImage(
		int topicId,
		Integer imageId,
		boolean illustrative
	) {
		this.changeImage(topicId, imageId, illustrative, Instant.now());
	}

	@Modifying
	@Transactional
	@Query("""
		update TopicStub t
		set t.mainImageId = :imageId,
			t.mainImageIsIllustrative = :illustrative,
			t.lastUpdatedOn = :lastUpdatedOn
		where t.id = :topicId and t.mainImageId is null
		""")
	void changeImageIfEmpty(
		@Param("topicId") int topicId,
		@Param("imageId") Integer imageId,
		@Param("illustrative") boolean illustrative,
		@Param("lastUpdatedOn") Instant lastUpdatedOn
	);

	@Modifying
	@Transactional
	default void changeImageIfEmpty(
		int topicId,
		Integer imageId,
		boolean illustrative
	) {
		this.changeImageIfEmpty(topicId, imageId, illustrative, Instant.now());
	}

}
