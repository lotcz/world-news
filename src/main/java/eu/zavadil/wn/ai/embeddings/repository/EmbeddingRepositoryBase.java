package eu.zavadil.wn.ai.embeddings.repository;

import com.pgvector.PGvector;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import lombok.extern.slf4j.Slf4j;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public abstract class EmbeddingRepositoryBase {

	private final JdbcTemplate jdbcTemplate;

	public EmbeddingRepositoryBase(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public abstract String getTableName();

	public abstract String getIdName();

	private final String selectSql = String.format(
		"SELECT embedding FROM %s WHERE %s = ?",
		this.getTableName(),
		this.getIdName()
	);

	private String selectDistancesSql = String.format(
		"""
				SELECT %s, embedding <=> ? as distance
				FROM %s
				ORDER BY distance
				OFFSET ? LIMIT ?
			""",
		this.getIdName(),
		this.getTableName()
	);

	private final String updateSql = String.format(
		"""
				INSERT INTO %s (%s, embedding) VALUES (?, ?)
				ON CONFLICT (%s)
				DO UPDATE SET embedding = EXCLUDED.embedding
			""",
		this.getTableName(),
		this.getIdName(),
		this.getIdName()
	);

	private final String deleteSql = String.format(
		"DELETE FROM %s	WHERE %s = ?",
		this.getTableName(),
		this.getIdName()
	);

	private final RowMapper<Embedding> embeddingRowMapper = (rs, rowNum) -> {
		PGobject po = (PGobject) rs.getObject("embedding");
		PGvector pv = new PGvector(po.getValue());
		return new Embedding(pv.toArray());
	};

	private final RowMapper<EmbeddingDistance> embeddingDistanceRowMapper = (rs, rowNum) ->
		new EmbeddingDistance(rs.getFloat("distance"), rs.getInt(this.getIdName()));

	public Embedding loadEmbedding(int entityId) {
		List<Embedding> results = jdbcTemplate.query(this.selectSql, this.embeddingRowMapper, entityId);
		if (results.isEmpty()) return null;
		return results.get(0);
	}

	public void deleteEmbedding(int entityId) {
		jdbcTemplate.update(this.deleteSql, entityId);
	}

	public void updateEmbedding(int entityId, Embedding embedding) {
		if (embedding == null) {
			log.warn("Empty embedding! Cannot update embedding in {} with id {}. Deleting...", entityId, this.getTableName());
			this.deleteEmbedding(entityId);
			return;
		}
		try {
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());
			jdbcTemplate.update(this.updateSql, entityId, vectorObj);
		} catch (Exception e) {
			throw new RuntimeException("Error when updating embedding", e);
		}
	}

	public List<EmbeddingDistance> searchSimilar(Embedding embedding, int offset, int limit) {
		if (embedding == null) {
			log.warn("Empty embedding! Cannot search for similar embedding in {}. Returning empty result set...", this.getTableName());
			return List.of();
		}
		try {
			PGobject vectorObj = new PGobject();
			vectorObj.setType("vector");
			vectorObj.setValue(embedding.toString());
			return jdbcTemplate.query(this.selectDistancesSql, this.embeddingDistanceRowMapper, vectorObj, offset, limit);
		} catch (Exception e) {
			throw new RuntimeException("Error when searching similar embeddings", e);
		}
	}

	public List<EmbeddingDistance> searchSimilar(Embedding embedding, int limit) {
		return this.searchSimilar(embedding, 0, limit);
	}

	public List<EmbeddingDistance> searchSimilar(Embedding embedding, int limit, float maxDistance) {
		List<EmbeddingDistance> result = new ArrayList<>(limit);
		int page = 0;
		while (result.size() < limit) {
			List<EmbeddingDistance> pageResult = this.searchSimilar(embedding, page * limit, limit);
			int pageIndex = 0;
			EmbeddingDistance dist;
			while (result.size() < limit && pageIndex < pageResult.size()) {
				dist = pageResult.get(pageIndex);
				if (dist.getDistance() > maxDistance) return result;
				result.add(dist);
				pageIndex++;
			}
			if (pageResult.size() < limit) break;
			page++;
		}
		return result;
	}

}
