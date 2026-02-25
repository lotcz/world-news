package eu.zavadil.wn.data.tag;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.Optional;

public interface TagStubRepository extends EntityRepository<TagStub> {

	Optional<TagStub> findFirstByName(String name);
}
