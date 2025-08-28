package eu.zavadil.wn.ai.embeddings.cache;

import com.pgvector.PGvector;
import eu.zavadil.java.util.HashUtils;
import eu.zavadil.wn.ai.embeddings.Embedding;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmbeddingsCache {

	@Autowired
	JdbcTemplate jdbcTemplate;

	private String createHash(String text) {
		return HashUtils.hashMd5(text);
	}

	private final RowMapper<Embedding> embeddingRowMapper = (rs, rowNum) -> {
		PGobject po = (PGobject) rs.getObject("embedding");
		PGvector pv = new PGvector(po.getValue());
		return new Embedding(pv.toArray());
	};

	public Embedding loadEmbeddingByHash(String hash) {
		String sql = "SELECT embedding FROM embeddings_cache WHERE hash = ?";
		List<Embedding> results = jdbcTemplate.query(sql, this.embeddingRowMapper, hash);
		if (results.isEmpty()) return null;
		return results.get(0);
	}

	public Embedding loadEmbedding(String text) {
		return this.loadEmbeddingByHash(this.createHash(text));
	}

	public void updateEmbedding(String text, Embedding embedding) {
		try {
			String sql = "INSERT INTO embeddings_cache (hash, embedding) VALUES (?, ?)";
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());
			jdbcTemplate.update(sql, this.createHash(text), vectorObj);
		} catch (Exception e) {
			throw new RuntimeException("Error when updating embeddings cache", e);
		}
	}

}
