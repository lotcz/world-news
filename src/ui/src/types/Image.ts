import {EntityBase} from "zavadil-ts-common";

export type Image = EntityBase & {
	originalUrl?: string | null;
	name: string;
	description?: string | null;
	author?: string | null;
	authorUrl?: string | null;
	source?: string | null;
	sourceUrl?: string | null;
	license?: string | null;
	isAiGenerated: boolean;
	verticalAlign?: string | null;
	horizontalAlign?: string | null;
	originalWidth?: number | null;
	originalHeight?: number | null;
}

export type ImageSearchResult = {
	id: string;
	url: string;
	title?: string | null;
	creator?: string | null;
	creator_url?: string | null;
	license?: string;
	source?: string;
	foreign_landing_url?: string | null;
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
