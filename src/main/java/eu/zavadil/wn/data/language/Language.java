package eu.zavadil.wn.data.language;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.wn.util.WnStringUtil;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	indexes = {
		@Index(columnList = "name"),
	}
)
public class Language extends EntityWithNameBase {

	private static final int CODE_SIZE = 5;

	@Column(length = CODE_SIZE)
	@Size(max = CODE_SIZE)
	private String code;

	@Column(columnDefinition = "TEXT")
	private String aiSystemPrompt;

	@JsonIgnore
	public List<String> getSystemPrompt() {
		return WnStringUtil.textToList(this.getAiSystemPrompt());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptCreateTitle;

	@JsonIgnore
	public List<String> getUserPromptCreateTitle() {
		return WnStringUtil.textToList(this.getAiUserPromptCreateTitle());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptCreateSummary;

	@JsonIgnore
	public List<String> getUserPromptCreateSummary() {
		return WnStringUtil.textToList(this.getAiUserPromptCreateSummary());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptDetectTags;

	@JsonIgnore
	public List<String> getUserPromptDetectTags() {
		return WnStringUtil.textToList(this.getAiUserPromptDetectTags());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptCompileArticles;

	@JsonIgnore
	public List<String> getUserPromptCompileArticles() {
		return WnStringUtil.textToList(this.getAiUserPromptCompileArticles());
	}
}
