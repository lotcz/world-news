package eu.zavadil.wn.ai.embeddings;

import eu.zavadil.wn.data.realm.Realm;

public class RealmEmbeddingDistance extends EntityEmbeddingDistance<Realm> {

	public RealmEmbeddingDistance(EmbeddingDistance embeddingDistance, Realm entity) {
		super(embeddingDistance, entity);
	}
}
