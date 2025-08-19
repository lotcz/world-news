package eu.zavadil.wn.service;

import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmbeddingStoreService {

	@Autowired
	JdbcTemplate jdbcTemplate;

	public void deleteEmbedding(int articleId) {
		String sql = """
				DELETE FROM article_embeddings
				WHERE article_id = ?
			""";
		jdbcTemplate.update(sql, articleId);
	}

	public void updateEmbedding(int articleId, String model, List<Double> embedding) {
		this.deleteEmbedding(articleId);
		try {
			String sql = """
					INSERT INTO article_embeddings(article_id, model, embedding)
					VALUES (?, ?, ?)
				""";
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());
			jdbcTemplate.update(sql, articleId, model, vectorObj);
		} catch (Exception e) {
			throw new RuntimeException("Error updating article embedding", e);
		}
	}

	public List<Integer> searchSimilar(List<Float> queryVector, String model, float maxDistance, int limit) {
		try {
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(queryVector.toString());

			String sql = """
				    SELECT article_id
				    FROM article_embeddings
				    WHERE model = ? AND (embedding <=> ?) <= ?
				    ORDER BY embedding <=> ?
				    LIMIT ?
				""";

			return jdbcTemplate.query(
				sql,
				new Object[]{model, vectorObj, maxDistance, vectorObj, limit},
				(rs, rowNum) -> rs.getInt("id")
			);
		} catch (Exception e) {
			throw new RuntimeException("Error when searching similar articles", e);
		}
	}

	public List<Integer> searchSimilar(List<Float> queryVector) {
		return this.searchSimilar(queryVector, "text-embedding-3-small", 0.2f, 10);
	}

}
