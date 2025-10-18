import {CacheStats, JavaHeapStats, QueueStats} from "zavadil-ts-common";

export type WnStats = {
	javaHeap: JavaHeapStats;
	realmCache: CacheStats;
	languageCache: CacheStats;
	articleSourceCache: CacheStats;
	ingestQueue: QueueStats;
	compileQueue: QueueStats;
	annotateQueue: QueueStats;
	categorizeQueue: QueueStats;
};

export type ClientStats = {
	languagesCache: CacheStats;
};

export type QueueSizes = {
	topicApproval: number;
	articleApproval: number;
	topicImageSupply: number;
};
