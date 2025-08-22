import {EntityBase} from "zavadil-ts-common";

export type AiLog = EntityBase & {
	systemPrompt?: string | null;
	userPrompt?: string | null;
	temperature?: number | null;
	model?: string | null;
	response?: string | null;
	entityType?: string | null;
	entityId?: number | null;
	operation?: string | null;

}
