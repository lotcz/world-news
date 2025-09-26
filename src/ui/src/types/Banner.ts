import {EntityWithName} from "zavadil-ts-common";
import {Website} from "./Website";

export type BannerBase = EntityWithName & {
	publishDate?: Date | null;
	contentHtml?: string | null;
	type: string;
}

export type BannerStub = BannerBase & {
	websiteId?: number | null;
}

export type Banner = BannerBase & {
	website?: Website;
}
