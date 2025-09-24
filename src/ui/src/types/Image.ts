import {EntityBase} from "zavadil-ts-common";

export type Image = EntityBase & {
	originalUrl?: string | null;
	name: string;
	description?: string | null;
	author?: string | null;
	source?: string | null;
	license?: string | null;
}

export type ImageSearchResult = {
	id: string;
	title: string;
	creator?: string;
	license?: string;
	source?: string;
	url: string;
	filetype: string;
	width: number;
	height: number;
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
