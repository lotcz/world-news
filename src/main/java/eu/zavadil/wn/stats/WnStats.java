package eu.zavadil.wn.stats;

import eu.zavadil.java.JavaHeapStats;
import eu.zavadil.java.caching.HashCacheStats;
import eu.zavadil.java.queues.SmartQueueProcessorStats;
import lombok.Data;

@Data
public class WnStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();

	private HashCacheStats realmCache;

	private HashCacheStats languageCache;

	private HashCacheStats articleSourceCache;

	private SmartQueueProcessorStats ingestQueue;

	private SmartQueueProcessorStats compileQueue;

	private SmartQueueProcessorStats annotateQueue;

	private SmartQueueProcessorStats categorizeQueue;

}
