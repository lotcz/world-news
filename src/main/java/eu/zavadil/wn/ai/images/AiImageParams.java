package eu.zavadil.wn.ai.images;

import eu.zavadil.java.util.StringUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiImageParams {

	private List<String> systemPrompt = new ArrayList<>();

	public String getSystemPromptString() {
		return StringUtils.linesToText(this.systemPrompt);
	}

	private List<String> userPrompt = new ArrayList<>();

	public String getUserPromptString() {
		return StringUtils.linesToText(this.userPrompt);
	}

	@Builder.Default
	private String model = "gpt-image-1";

	@Builder.Default
	private AiImageResponseType responseType = AiImageResponseType.Base64;

	@Builder.Default
	private AiImageResponseFormat format = AiImageResponseFormat.WebP;

	@Builder.Default
	private String size = "1536x1024";

}
