package eu.zavadil.wn.data.image;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Image extends EntityBase {

	private String originalUrl;

	private String name;

	private String description;

}
