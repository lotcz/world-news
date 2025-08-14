package eu.zavadil.wn.worker.ingest.rss;

import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.wn.data.ImportType;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.worker.ingest.ArticleData;
import eu.zavadil.wn.worker.ingest.ArticleDataSource;
import eu.zavadil.wn.worker.ingest.ArticleDataSourceContainer;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ArticleDataSourceRss implements ArticleDataSource {

	@Autowired
	ArticleDataSourceContainer articleImporterContainer;

	@PostConstruct
	public void init() {
		this.articleImporterContainer.put(ImportType.Other, this);
	}

	@Override
	public BasicIterator<ArticleData> getIterator(ArticleSource articleSource) {
		return new XmlReaderIterator(articleSource.getUrl());
	}

}
