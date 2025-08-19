package eu.zavadil.wn.service;

import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.data.tag.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

	@Autowired
	TagRepository tagRepository;

	@Transactional
	public Tag save(Tag tag) {
		return this.tagRepository.save(tag);
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
