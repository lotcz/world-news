import {EntityBase} from "zavadil-ts-common";

export type Image = EntityBase & {
	originalUrl?: string | null;
	name: string;
	description?: string | null;
}
