package eu.zavadil.wn.worker.ingest.data;

import eu.zavadil.wn.data.articleSource.ImportType;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class ArticleDataSourceContainer extends HashMap<ImportType, ArticleDataSource> {

}
