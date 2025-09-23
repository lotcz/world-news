package eu.zavadil.wn.cc;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface CreativeCommons {

	Page<ImageSearchResult> searchImages(String search, PageRequest pr);

}
