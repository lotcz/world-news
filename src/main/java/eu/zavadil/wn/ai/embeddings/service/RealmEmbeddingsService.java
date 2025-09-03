package eu.zavadil.wn.ai.embeddings.service;

import eu.zavadil.wn.ai.embeddings.Embedding;
import eu.zavadil.wn.ai.embeddings.cache.EmbeddingsCache;
import eu.zavadil.wn.ai.embeddings.engine.AiEmbeddingsEngine;
import eu.zavadil.wn.ai.embeddings.repository.RealmEmbeddingsRepository;
import eu.zavadil.wn.data.realm.Realm;
import eu.zavadil.wn.data.realm.RealmCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RealmEmbeddingsService extends EmbeddingsServiceBase<Realm> {

	@Autowired
	RealmCache realmCache;

	@Autowired
	public RealmEmbeddingsService(
		AiEmbeddingsEngine aiEngine,
		EmbeddingsCache embeddingsCache,
		RealmEmbeddingsRepository embeddingsRepository
	) {
		super(aiEngine, embeddingsCache, embeddingsRepository);
	}

	public Embedding updateEmbedding(Realm realm) {
		return super.updateEmbedding(realm.getId(), realm.getSummary());
	}

	@Override
	public Realm loadEntity(int id) {
		return this.realmCache.get(id);
	}

}
