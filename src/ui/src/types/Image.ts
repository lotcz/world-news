import {EntityBase} from "zavadil-ts-common";

export type Image = EntityBase & {
	originalUrl?: string | null;
	name: string;
	description?: string | null;
	author?: string | null;
	source?: string | null;
	license?: string | null;
	isAiGenerated: boolean;
}

export type ImageSearchResult = {
	id: string;
	title?: string | null;
	creator?: string | null;
	creator_url?: string | null;
	detail_url?: string | null;
	license?: string;
	source?: string;
	url: string;
	thumbnail: string;
	filetype: string;
	attribution: string;
	width: number;
	height: number;
	indexed_on?: Date;
}

export type ImageHealth = {
	name: string;
	size: number;
	width: number;
	height: number;
	mime: string;
}

export type ImagezSettingsPayload = {
	baseUrl: string;
	secretToken: string;
}
