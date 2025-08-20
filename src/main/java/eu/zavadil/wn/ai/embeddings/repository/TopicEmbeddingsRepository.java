package eu.zavadil.wn.ai.embeddings.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class TopicEmbeddingsRepository extends EmbeddingRepositoryBase {

	public TopicEmbeddingsRepository(@Autowired JdbcTemplate jdbcTemplate) {
		super(jdbcTemplate);
	}

	@Override
	public String getTableName() {
		return "topic_embeddings";
	}

	@Override
	public String getIdName() {
		return "topic_id";
	}
}
