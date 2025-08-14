package eu.zavadil.wn.worker.ingest;

import eu.zavadil.java.iterators.BasicIterator;
import eu.zavadil.wn.data.articleSource.ArticleSource;

public interface ArticleDataSource {

	BasicIterator<ArticleData> getIterator(ArticleSource articleSource);

}
