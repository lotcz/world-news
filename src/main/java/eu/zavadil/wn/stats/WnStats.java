package eu.zavadil.wn.stats;

import eu.zavadil.java.JavaHeapStats;
import eu.zavadil.java.caching.HashCacheStats;
import lombok.Getter;
import lombok.Setter;

@Getter
public class WnStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();

	@Setter
	private HashCacheStats realmCache;

}
