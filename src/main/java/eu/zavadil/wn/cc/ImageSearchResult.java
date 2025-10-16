package eu.zavadil.wn.cc;

import lombok.Data;

@Data
public class ImageSearchResult {

	private String id;

	private String title;

	private String creator;

	private String creator_url;

	private String license;

	private String source;

	private String foreign_landing_url;
	
	private String url;

	private String thumbnail;

	private String filetype;

	private String indexed_on;

	private String attribution;

	private int width;

	private int height;

}
