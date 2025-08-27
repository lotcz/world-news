package eu.zavadil.wn.service;

import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.data.tag.TagRepository;
import eu.zavadil.wn.data.tag.TagStub;
import eu.zavadil.wn.data.tag.TagStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

	@Autowired
	TagRepository tagRepository;

	@Autowired
	TagStubRepository tagStubRepository;

	@Transactional
	public Tag save(Tag tag) {
		return this.tagRepository.save(tag);
	}

	@Transactional
	public TagStub save(TagStub tag) {
		return this.tagStubRepository.save(tag);
	}

	public TagStub loadById(int id) {
		return this.tagStubRepository.findById(id).orElse(null);
	}

	public void deleteById(int id) {
		this.tagStubRepository.deleteById(id);
	}

	public Page<Tag> search(@Param("search") String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.tagRepository.findAll(pr)
			: this.tagRepository.search(search, pr);
	}

	public List<Tag> loadByArticleId(int articleId) {
		return this.tagRepository.loadByArticleId(articleId);
	}

	/**
	 * If the tag is a synonym of another one, return the main one.
	 */
	public Tag desynonymize(Tag tag) {
		if (tag == null) return null;
		if (tag.getSynonymOf() == null) return tag;
		return this.desynonymize(tag.getSynonymOf());
	}

	@Transactional
	public Tag obtain(String name) {
		Tag tag = this.tagRepository.findFirstByName(name).orElse(null);
		if (tag != null) return this.desynonymize(tag);
		tag = new Tag();
		tag.setName(name);
		return this.save(tag);
	}

	List<Tag> findSynonyms(Tag tag) {
		return this.tagRepository.findAllBySynonymOf(tag);
	}
}
