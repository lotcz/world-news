package eu.zavadil.wn.data.image;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "image")
public class ImageStub extends ImageBase {

	@Column(name = "article_id")
	private int articleId;

}
