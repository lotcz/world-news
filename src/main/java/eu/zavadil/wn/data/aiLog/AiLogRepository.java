package eu.zavadil.wn.data.aiLog;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface AiLogRepository extends EntityRepository<AiLog> {

	@Query("""
			select a
			from AiLog a
			where (:fromDate IS NULL OR a.createdOn >= :fromDate)
				and (:toDate IS NULL OR a.createdOn <= :toDate)
		""")
	Page<AiLog> filter(
		@Param("fromDate") Instant fromDate,
		@Param("toDate") Instant toDate,
		PageRequest pr
	);

}
