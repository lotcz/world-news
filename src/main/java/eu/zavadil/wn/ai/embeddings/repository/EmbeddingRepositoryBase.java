package eu.zavadil.wn.ai.embeddings.repository;

import com.pgvector.PGvector;
import eu.zavadil.java.util.HashUtils;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

public abstract class EmbeddingRepositoryBase {

	private final JdbcTemplate jdbcTemplate;

	public EmbeddingRepositoryBase(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public abstract String getTableName();

	public abstract String getIdName();

	public String createHash(String text) {
		return HashUtils.hashMd5(text);
	}

	private final RowMapper<Embedding> embeddingRowMapper = (rs, rowNum) -> {
		PGobject po = (PGobject) rs.getObject("embedding");
		PGvector pv = new PGvector(po.getValue());
		return new Embedding(pv.toArray());
	};

	private RowMapper<EmbeddingDistance> getEmbeddingDistanceRowMapper() {
		String idName = this.getIdName();
		return (rs, rowNum) -> new EmbeddingDistance(rs.getFloat("distance"), rs.getInt(idName));
	}

	public Embedding loadEmbedding(String text) {
		String sql = String.format(
			"SELECT embedding FROM %s WHERE hash = ?",
			this.getTableName()
		);
		List<Embedding> results = jdbcTemplate.query(sql, this.embeddingRowMapper, this.createHash(text));
		if (results.isEmpty()) return null;
		return results.get(0);
	}

	public void deleteEmbedding(int entityId) {
		String sql = String.format(
			"DELETE FROM %s	WHERE %s = ?",
			this.getTableName(),
			this.getIdName()
		);
		jdbcTemplate.update(sql, entityId);
	}

	public void updateEmbedding(int entityId, String text, Embedding embedding) {
		this.deleteEmbedding(entityId);
		try {
			String sql = String.format(
				"INSERT INTO %s (%s, hash, embedding) VALUES (?, ?, ?)",
				this.getTableName(),
				this.getIdName()
			);
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());
			jdbcTemplate.update(sql, entityId, this.createHash(text), vectorObj);
		} catch (Exception e) {
			throw new RuntimeException("Error updating article embedding", e);
		}
	}

	public List<EmbeddingDistance> searchSimilar(Embedding embedding, float maxDistance, int limit) {
		try {
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());

			String sql = String.format(
				"""
						SELECT %s, embedding <=> ? as distance
						FROM %s
						WHERE (embedding <=> ?) <= ?
						ORDER BY distance
						LIMIT ?
					""",
				this.getIdName(),
				this.getTableName()
			);

			RowMapper<EmbeddingDistance> rowMapper = this.getEmbeddingDistanceRowMapper();

			return jdbcTemplate.query(
				sql,
				new Object[]{vectorObj, vectorObj, maxDistance, limit},
				rowMapper
			);
		} catch (Exception e) {
			throw new RuntimeException("Error when searching similar articles", e);
		}
	}

}
