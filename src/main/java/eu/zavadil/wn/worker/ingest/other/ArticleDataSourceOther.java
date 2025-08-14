package eu.zavadil.wn.worker.ingest.other;

import eu.zavadil.java.iterators.SmartIterator;
import eu.zavadil.wn.data.ImportType;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.worker.ingest.ArticleData;
import eu.zavadil.wn.worker.ingest.ArticleDataSource;
import eu.zavadil.wn.worker.ingest.ArticleDataSourceContainer;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ArticleDataSourceOther implements ArticleDataSource {

	@Autowired
	ArticleDataSourceContainer articleImporterContainer;

	@PostConstruct
	public void init() {
		this.articleImporterContainer.put(ImportType.Other, this);
	}

	@Override
	public SmartIterator<ArticleData> getIterator(ArticleSource articleSource) {
		throw new RuntimeException("Not implemented!");
	}

}
