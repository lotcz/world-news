package eu.zavadil.wn.imagez;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImagezSettingsPayload {

	private String baseUrl;

	private String secretToken;
}
