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

import java.util.ArrayList;
import java.util.List;

@Service
public class TagService {

	@Autowired
	TagRepository tagRepository;

	@Autowired
	TagStubRepository tagStubRepository;

	@Transactional
	public Tag save(Tag tag) {
		if (tag.getSynonymOf() != null) {
			Tag synonym = this.desynonymize(tag.getSynonymOf(), List.of(tag.getId()));
			tag.setSynonymOf(synonym);
		}
		return this.tagRepository.save(tag);
	}

	@Transactional
	public TagStub save(TagStub stub) {
		if (stub.getId() != null && stub.getSynonymOfId() != null) {
			Tag synonymOf = this.tagRepository.findById(stub.getSynonymOfId()).orElseThrow();
			Tag synonym = this.desynonymize(synonymOf, List.of(stub.getId()));
			stub.setSynonymOfId(synonym.getId());
		}
		return this.tagStubRepository.save(stub);
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

	public List<Tag> loadSynonyms(int tagId) {
		return this.tagRepository.findAllBySynonymOfId(tagId);
	}

	private Tag desynonymize(Tag tag, List<Integer> inChain) {
		if (inChain.contains(tag.getId())) throw new RuntimeException("Tag synonyms form a circle!");
		if (tag.getSynonymOf() == null) return tag;
		List<Integer> nextChain = new ArrayList<>(inChain);
		nextChain.add(tag.getId());
		return this.desynonymize(tag.getSynonymOf(), nextChain);
	}

	/**
	 * If the tag is a synonym of another one, return the main one.
	 */
	public Tag desynonymize(Tag tag) {
		if (tag == null) return null;
		if (tag.getId() == null || tag.getSynonymOf() == null) return tag;
		return this.desynonymize(tag.getSynonymOf(), List.of(tag.getId()));
	}

	@Transactional
	public Tag obtain(String name) {
		Tag tag = this.tagRepository.findFirstByName(name).orElse(null);
		if (tag != null) return this.desynonymize(tag);
		tag = new Tag();
		tag.setName(name);
		return this.save(tag);
	}

	public Page<Tag> loadSynonymsForCleanup() {
		return this.tagRepository.findAllBySynonymOfNotNullAndArticleCountGreaterThan(0, PageRequest.of(0, 10));
	}
}
