package eu.zavadil.wn.service;

import eu.zavadil.wn.data.tag.Tag;
import eu.zavadil.wn.data.tag.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TagService {

	@Autowired
	TagRepository tagRepository;

	@Transactional
	public Tag save(Tag tag) {
		return this.tagRepository.save(tag);
	}

	@Transactional
	public Tag obtain(String name) {
		Tag tag = this.tagRepository.findFirstByName(name).orElse(null);
		if (tag == null) {
			tag = new Tag();
			tag.setName(name);
			this.save(tag);
		}
		return tag;
	}

}
