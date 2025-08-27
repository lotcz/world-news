package eu.zavadil.wn.data.tag;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends EntityRepository<Tag> {

	@Query("""
				select t
				from Tag t
				where lower(t.name) LIKE %:search%
		""")
	Page<Tag> search(@Param("search") String search, PageRequest pr);

	@Query("""
			select t
			from ArticleTagStub ats
			join Tag t on (t.id = ats.id.tagId)
			where ats.id.articleId = :articleId
		""")
	List<Tag> loadByArticleId(int articleId);

	Optional<Tag> findFirstByName(String name);

	List<Tag> findAllBySynonymOf(Tag tag);

	List<Tag> findAllBySynonymOfId(int tagId);

	Page<Tag> findAllBySynonymOfNotNullAndArticleCountGreaterThan(int minArticleCount, PageRequest pr);
}
