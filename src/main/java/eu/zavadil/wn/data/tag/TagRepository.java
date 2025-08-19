package eu.zavadil.wn.data.tag;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends EntityRepository<Tag> {

	Optional<Tag> findFirstByName(String name);
	
	List<Tag> findAllBySynonymOf(Tag tag);

}
