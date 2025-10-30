package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface ArticleStubRepository extends EntityRepository<ArticleStub> {

	@Modifying
	@Transactional
	@Query("""
		update ArticleStub a
		set a.topicId = :topicId, a.lastUpdatedOn = :lastUpdatedOn
		where a.id = :articleId
		""")
	void moveToTopic(
		@Param("articleId") int articleId,
		@Param("topicId") int topicId,
		@Param("lastUpdatedOn") Instant lastUpdatedOn
	);

	@Modifying
	@Transactional
	default void moveToTopic(int articleId, int topicId) {
		this.moveToTopic(articleId, topicId, Instant.now());
	}

	@Modifying
	@Transactional
	@Query("""
		update ArticleStub a
		set a.topicId = :toTopicId, a.lastUpdatedOn = :lastUpdatedOn
		where a.topicId = :fromTopicId
		""")
	void mergeTopics(
		@Param("fromTopicId") int fromTopicId,
		@Param("toTopicId") int toTopicId,
		@Param("lastUpdatedOn") Instant lastUpdatedOn
	);

	@Modifying
	@Transactional
	default void mergeTopics(int fromTopicId, int toTopicId) {
		this.mergeTopics(fromTopicId, toTopicId, Instant.now());
	}

	@Modifying
	@Transactional
	@Query("""
		update ArticleStub a
		set a.articleType = :articleType, a.lastUpdatedOn = :lastUpdatedOn
		where a.id = :articleId
		""")
	void changeArticleType(
		@Param("articleId") int articleId,
		@Param("articleType") ArticleType articleType,
		@Param("lastUpdatedOn") Instant lastUpdatedOn
	);

	@Modifying
	@Transactional
	default void changeArticleType(int articleId, ArticleType articleType) {
		this.changeArticleType(articleId, articleType, Instant.now());
	}

	@Modifying
	@Transactional
	@Query("""
		update ArticleStub a
		set a.mainImageId = :imageId,
			a.mainImageIsIllustrative = :illustrative,
			a.lastUpdatedOn = :lastUpdatedOn
		where a.id = :articleId
		""")
	void changeImage(
		@Param("articleId") int articleId,
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
}
