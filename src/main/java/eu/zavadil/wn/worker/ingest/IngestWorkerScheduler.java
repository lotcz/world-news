package eu.zavadil.wn.worker.ingest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class IngestWorkerScheduler {

	@Autowired
	IngestQueueProcessor ingestWorker;

	@Scheduled(fixedDelay = 5 * 60 * 1000)
	public void execute() {
		// stop processing temporarily to save money
		//this.ingestWorker.process();
	}

}
