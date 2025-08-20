package eu.zavadil.wn.ai.embeddings.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ArticleEmbeddingsRepository extends EmbeddingRepositoryBase {

	public ArticleEmbeddingsRepository(@Autowired JdbcTemplate jdbcTemplate) {
		super(jdbcTemplate);
	}

	@Override
	public String getTableName() {
		return "article_embeddings";
	}

	@Override
	public String getIdName() {
		return "article_id";
	}
}
