package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.entity.cache.RepositoryNamedLookupCache;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.RealmEmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.service.RealmEmbeddingsService;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.data.realm.RealmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RealmService extends RepositoryNamedLookupCache<Realm> {

	@Autowired
	RealmEmbeddingsService realmEmbeddingsService;

	@Autowired
	TopicEmbeddingsService topicEmbeddingsService;

	@Autowired
	public RealmService(RealmRepository repository) {
		super(repository, Realm::new);
	}

	@Transactional
	public Realm save(Realm realm) {
		Realm saved = this.set(realm);
		this.realmEmbeddingsService.updateEmbedding(saved);
		return saved;
	}

	public List<RealmEmbeddingDistance> findSimilar(Embedding embedding, float maxDistance, int limit) {
		List<EmbeddingDistance> similar = this.realmEmbeddingsService.searchSimilar(embedding, maxDistance, limit);
		return similar.stream().map(
			(ed) -> new RealmEmbeddingDistance(ed, this.get(ed.getEntityId()))
		).toList();
	}

	public List<RealmEmbeddingDistance> findSimilar(Embedding embedding, int limit) {
		return this.findSimilar(embedding, 2.0F, limit);
	}

	public List<RealmEmbeddingDistance> findSimilarToTopic(int topicId, int limit) {
		Embedding embedding = this.topicEmbeddingsService.loadEmbedding(topicId);
		return this.findSimilar(embedding, limit);
	}
}
