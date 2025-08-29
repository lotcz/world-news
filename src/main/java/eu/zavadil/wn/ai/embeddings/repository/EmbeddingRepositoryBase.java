package eu.zavadil.wn.ai.embeddings.repository;

import com.pgvector.PGvector;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import lombok.extern.slf4j.Slf4j;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

@Slf4j
public abstract class EmbeddingRepositoryBase {

	private final JdbcTemplate jdbcTemplate;

	public EmbeddingRepositoryBase(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public abstract String getTableName();

	public abstract String getIdName();

	private final RowMapper<Embedding> embeddingRowMapper = (rs, rowNum) -> {
		PGobject po = (PGobject) rs.getObject("embedding");
		PGvector pv = new PGvector(po.getValue());
		return new Embedding(pv.toArray());
	};

	private RowMapper<EmbeddingDistance> getEmbeddingDistanceRowMapper() {
		String idName = this.getIdName();
		return (rs, rowNum) -> new EmbeddingDistance(rs.getFloat("distance"), rs.getInt(idName));
	}

	public Embedding loadEmbedding(int entityId) {
		String sql = String.format(
			"SELECT embedding FROM %s WHERE %s = ?",
			this.getTableName(),
			this.getIdName()
		);
		List<Embedding> results = jdbcTemplate.query(sql, this.embeddingRowMapper, entityId);
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

	public void updateEmbedding(int entityId, Embedding embedding) {
		this.deleteEmbedding(entityId);
		try {
			String sql = String.format(
				"INSERT INTO %s (%s, embedding) VALUES (?, ?)",
				this.getTableName(),
				this.getIdName()
			);
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());
			jdbcTemplate.update(sql, entityId, vectorObj);
		} catch (Exception e) {
			throw new RuntimeException("Error when updating embedding", e);
		}
	}

	// todo: remove maxDistance and apply it programatically later
	// problem with vector index search
	// Claude knew :-D
	//
	public List<EmbeddingDistance> searchSimilar(Embedding embedding, float maxDistance, int limit) {
		if (embedding == null) {
			log.warn("Cannot search for similar in {}. Empty embedding! Returning empty result set...", this.getTableName());
			return List.of();
		}
		try {
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());

			log.trace("embedding card.: {}, dist: {}, limit: {}", embedding.size(), maxDistance, limit);

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
				rowMapper,
				vectorObj, vectorObj, maxDistance, limit
			);
		} catch (Exception e) {
			throw new RuntimeException("Error when searching similar embeddings", e);
		}
	}

}
