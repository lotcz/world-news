import {CacheStats, JavaHeapStats} from "zavadil-ts-common";

export type WnStats = {
	javaHeap: JavaHeapStats;
	realmCache: CacheStats;
};

export type ClientStats = {
	languagesCache: CacheStats;
};
