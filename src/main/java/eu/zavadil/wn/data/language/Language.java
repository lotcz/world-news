package eu.zavadil.wn.data.language;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.java.util.StringUtils;
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
		return StringUtils.textToLines(this.getAiSystemPrompt());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptCreateTitle;

	@JsonIgnore
	public List<String> getUserPromptCreateTitle() {
		return StringUtils.textToLines(this.getAiUserPromptCreateTitle());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptCreateSummary;

	@JsonIgnore
	public List<String> getUserPromptCreateSummary() {
		return StringUtils.textToLines(this.getAiUserPromptCreateSummary());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptDetectTags;

	@JsonIgnore
	public List<String> getUserPromptDetectTags() {
		return StringUtils.textToLines(this.getAiUserPromptDetectTags());
	}

	@Column(columnDefinition = "TEXT")
	private String aiUserPromptCompileArticles;

	@JsonIgnore
	public List<String> getUserPromptCompileArticles() {
		return StringUtils.textToLines(this.getAiUserPromptCompileArticles());
	}
}
