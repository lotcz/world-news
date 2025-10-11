package eu.zavadil.wn.cc;

import eu.zavadil.java.spring.common.client.HttpApiClientBase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * https://api.openverse.org/v1/
 */
@Service
public class CreativeCommonsClientHttp extends HttpApiClientBase implements CreativeCommons {

	public CreativeCommonsClientHttp() {
		super("https://api.openverse.org/v1");
	}

	@Override
	public Page<ImageSearchResult> searchImages(String search, PageRequest pr) {
		Map<String, String> params = new HashMap<>();
		params.put("q", search);
		params.put("page", String.valueOf(pr.getPageNumber() + 1));
		params.put("page_size", String.valueOf(pr.getPageSize()));
		params.put("license_type", "commercial");
		params.put("unstable__sort_by", "indexed_on");
		ImageSearchResultPage page = this.get("images", params, ImageSearchResultPage.class);
		return new PageImpl<>(page.getResults(), pr, page.getResultCount());
	}
}
