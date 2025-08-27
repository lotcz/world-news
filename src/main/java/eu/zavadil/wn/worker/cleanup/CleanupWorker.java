package eu.zavadil.wn.worker.cleanup;

import eu.zavadil.wn.worker.cleanup.synonyms.SynonymsCleanupWorker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CleanupWorker {

	@Autowired
	SynonymsCleanupWorker synonymsCleanupWorker;

	public void cleanup() {
		this.synonymsCleanupWorker.process();
	}

}
