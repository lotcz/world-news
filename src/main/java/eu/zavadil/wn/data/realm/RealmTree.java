package eu.zavadil.wn.data.realm;

import eu.zavadil.java.util.IntegerUtils;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RealmTree {

	private Realm realm;

	private List<RealmTree> children;

	public static List<Realm> childrenOf(int realmId, List<Realm> all) {
		return all.stream()
			.filter(r -> IntegerUtils.safeEquals(r.getParentId(), realmId))
			.toList();
	}

	public static RealmTree of(Realm root, List<Realm> all) {
		List<RealmTree> children = all.stream()
			.filter(r -> root == null ? r.getParentId() == null : IntegerUtils.safeEquals(r.getParentId(), root.getId()))
			.map(r -> RealmTree.of(r, all))
			.toList();
		return new RealmTree(root, children);
	}

	public boolean isRoot() {
		return this.realm == null;
	}

}
