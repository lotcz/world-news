package eu.zavadil.wn.service;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.EmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.RealmEmbeddingDistance;
import eu.zavadil.wn.ai.embeddings.service.RealmEmbeddingsService;
import eu.zavadil.wn.ai.embeddings.service.TopicEmbeddingsService;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.data.realm.RealmCache;
import eu.zavadil.wn.data.realm.RealmTree;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RealmService {

	@Autowired
	RealmEmbeddingsService realmEmbeddingsService;

	@Autowired
	TopicEmbeddingsService topicEmbeddingsService;

	@Autowired
	RealmCache realmCache;

	private Lazy<RealmTree> realmTree = new Lazy<>(
		() -> RealmTree.of(null, this.realmCache.all())
	);

	public Realm loadById(int realmId) {
		return this.realmCache.get(realmId);
	}

	public List<Realm> loadAll() {
		return this.realmCache.all();
	}

	public List<Realm> loadChildren(int id) {
		return RealmTree.childrenOf(id, this.loadAll());
	}

	public RealmTree getTree() {
		return this.realmTree.get();
	}

	public Page<Realm> search(String search, PageRequest pr) {
		return this.realmCache.search(search, pr);
	}

	@Transactional
	public Realm save(Realm realm) {
		Realm saved = this.realmCache.set(realm);
		this.realmTree.reset();
		this.realmEmbeddingsService.updateEmbedding(saved);
		return saved;
	}

	public void deleteById(int realmId) {
		this.realmCache.deleteById(realmId);
	}

	public List<RealmEmbeddingDistance> findSimilar(Embedding embedding, int limit, Float maxDistance) {
		List<EmbeddingDistance> similar = (maxDistance == null) ? this.realmEmbeddingsService.searchSimilar(embedding, limit)
			: this.realmEmbeddingsService.searchSimilar(embedding, limit, maxDistance);
		return similar.stream().map(
			(ed) -> new RealmEmbeddingDistance(ed, this.realmCache.get(ed.getEntityId()))
		).toList();
	}

	public List<RealmEmbeddingDistance> findSimilar(Embedding embedding, int limit) {
		return this.findSimilar(embedding, limit, null);
	}

	public List<RealmEmbeddingDistance> findSimilarToTopic(int topicId, int limit) {
		Embedding embedding = this.topicEmbeddingsService.obtainEmbedding(topicId);
		return this.findSimilar(embedding, limit);
	}
}
