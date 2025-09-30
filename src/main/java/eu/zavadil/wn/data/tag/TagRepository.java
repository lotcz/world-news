package eu.zavadil.wn.data.tag;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.java.util.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends EntityRepository<Tag> {

	@Query("""
				select t
				from Banner t
				where t.name LIKE %:search%
		""")
	Page<Tag> searchInternal(@Param("search") String search, Pageable pr);

	default Page<Tag> search(String search, Pageable pr) {
		return this.searchInternal(StringUtils.safeUpperCase(search), pr);
	}

	@Query("""
			select t
			from ArticleTagStub ats
			join Banner t on (t.id = ats.id.tagId)
			where ats.id.articleId = :articleId
		""")
	List<Tag> loadByArticleId(int articleId);

	Optional<Tag> findFirstByLanguageIdAndName(int languageId, String name);

	List<Tag> findAllBySynonymOf(Tag tag);

	List<Tag> findAllBySynonymOfId(int tagId);

	Page<Tag> findAllBySynonymOfNotNullAndArticleCountGreaterThan(int minArticleCount, Pageable pr);
}
