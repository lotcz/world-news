package eu.zavadil.wn.worker.annotate;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AnnotateWorkerScheduler {

	@Autowired
	AnnotateQueueProcessor annotateWorker;

	@Scheduled(fixedDelay = 5 * 1000)
	public void execute() {
		this.annotateWorker.process();
	}

}
