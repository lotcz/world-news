import {LookupTableEntity} from "zavadil-ts-common";

export type Language = LookupTableEntity & {
	code?: string;
	aiSystemPrompt?: string;
	aiUserPromptCreateTitle?: string;
	aiUserPromptCreateSummary?: string;
	aiUserPromptDetectTags?: string;
	aiUserPromptCompileArticles?: string;
}
