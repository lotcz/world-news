package eu.zavadil.wn.imagez;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResizeRequest {

	private String type;

	private int width;

	private int height;

	private String ext;
}
