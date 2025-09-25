package eu.zavadil.wn.ai.images;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiImageResponse {

	@Builder.Default
	private boolean isError = false;

	private String response;

	@Builder.Default
	private AiImageResponseType responseType = AiImageResponseType.Base64;

	@Builder.Default
	private AiImageResponseFormat format = AiImageResponseFormat.WebP;

	private long inputTokens;

	private long outputTokens;

	private long processingTimeNs;

}
