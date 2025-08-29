package eu.zavadil.wn.ai.embeddings.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class RealmEmbeddingsRepository extends EmbeddingRepositoryBase {

	public RealmEmbeddingsRepository(@Autowired JdbcTemplate jdbcTemplate) {
		super(jdbcTemplate);
	}

	@Override
	public String getTableName() {
		return "realm_embeddings";
	}

	@Override
	public String getIdName() {
		return "realm_id";
	}
}
