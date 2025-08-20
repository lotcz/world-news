package eu.zavadil.wn.worker.ingest.data.rss;

import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.wn.data.ImportType;
import eu.zavadil.wn.data.articleSource.ArticleSource;
import eu.zavadil.wn.worker.ingest.data.ArticleData;
import eu.zavadil.wn.worker.ingest.data.ArticleDataSource;
import eu.zavadil.wn.worker.ingest.data.ArticleDataSourceContainer;
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
		this.articleImporterContainer.put(ImportType.Rss, this);
	}

	@Override
	public BasicIterator<ArticleData> getIterator(ArticleSource articleSource) {
		return new XmlReaderIterator(articleSource.getUrl());
	}

}
