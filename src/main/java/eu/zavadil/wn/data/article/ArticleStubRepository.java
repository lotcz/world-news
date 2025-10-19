package eu.zavadil.wn.data.article;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArticleStubRepository extends EntityRepository<ArticleStub> {

	@Modifying
	@Transactional
	@Query("""
		update ArticleStub a
		set a.topicId = :topicId
		where a.id = :articleId
		""")
	void moveToTopic(@Param("articleId") int articleId, @Param("topicId") int topicId);

	@Modifying
	@Transactional
	@Query("""
		update ArticleStub a
		set a.topicId = :toTopicId
		where a.topicId = :fromTopicId
		""")
	void mergeTopics(@Param("fromTopicId") int fromTopicId, @Param("toTopicId") int toTopicId);

	@Modifying
	@Transactional
	@Query("""
		update ArticleStub a
		set a.articleType = :articleType
		where a.id = :articleId
		""")
	void changeArticleType(@Param("articleId") int articleId, @Param("articleType") ArticleType articleType);

}
