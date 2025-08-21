package eu.zavadil.wn.stats;

import eu.zavadil.java.JavaHeapStats;
import eu.zavadil.java.caching.HashCacheStats;
import eu.zavadil.java.queues.SmartQueueProcessorStats;
import lombok.Getter;
import lombok.Setter;

@Getter
public class WnStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();

	@Setter
	private HashCacheStats realmCache;

	@Setter
	private HashCacheStats languageCache;

	@Setter
	private HashCacheStats articleSourceCache;

	@Setter
	private SmartQueueProcessorStats compileQueue;

}
