package eu.zavadil.wn.imagez;

import lombok.Data;

@Data
public class ImageHealthPayload {

	private String name;
	
	private int size;

	private int width;

	private int height;

	private String mime;
}
