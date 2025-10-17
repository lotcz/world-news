package eu.zavadil.wn.worker.ingest.data;

import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.wn.data.articleSource.ArticleSource;

public interface ArticleDataSource {

	BasicIterator<ExternalArticleData> getIterator(ArticleSource articleSource);

}
