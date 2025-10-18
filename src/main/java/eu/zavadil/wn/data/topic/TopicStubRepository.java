package eu.zavadil.wn.data.topic;

import eu.zavadil.java.spring.common.entity.EntityRepository;
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
	void markAsChanged(@Param("topicId") int topicId, Instant lastUpdatedOn);

	@Modifying
	@Transactional
	default void markAsChanged(int topicId) {
		this.markAsChanged(topicId, Instant.now());
	}
}
