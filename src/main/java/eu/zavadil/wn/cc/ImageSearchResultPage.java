package eu.zavadil.wn.cc;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ImageSearchResultPage {

	@JsonProperty("result_count")
	private int resultCount;

	@JsonProperty("page_count")
	private int pageCount;

	@JsonProperty("page_size")
	private int pageSize;

	@JsonProperty("page")
	private int page;

	private List<ImageSearchResult> results;
	
}
