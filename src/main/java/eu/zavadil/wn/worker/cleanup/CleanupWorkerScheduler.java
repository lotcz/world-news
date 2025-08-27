package eu.zavadil.wn.worker.cleanup;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CleanupWorkerScheduler {

	@Autowired
	CleanupWorker cleanupWorker;

	@Scheduled(fixedDelay = 10 * 1000)
	public void execute() {
		this.cleanupWorker.cleanup();
	}

}
