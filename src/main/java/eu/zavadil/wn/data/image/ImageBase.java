package eu.zavadil.wn.data.image;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ImageBase extends EntityBase {

	private String originalUrl;

	private String path;

	private String description;

}
