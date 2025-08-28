package eu.zavadil.wn.data.tag;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.java.util.StringUtils;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class TagBase extends EntityWithNameBase {

	@Column(updatable = false, insertable = false)
	private int articleCount = 0;

	@Override
	public void setName(String name) {
		super.setName(StringUtils.safeUpperCase(name));
	}

}
