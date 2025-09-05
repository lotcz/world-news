package eu.zavadil.wn.worker.categorize;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CategorizeWorkerScheduler {

	@Autowired
	CategorizeQueueProcessor categorizeWorker;

	@Scheduled(fixedDelay = 5 * 1000, initialDelay = 3 * 1000)
	public void execute() {
		this.categorizeWorker.process();
	}

}
