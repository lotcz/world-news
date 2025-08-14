package eu.zavadil.wn.worker.ingest;

import eu.zavadil.wn.data.ImportType;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class ArticleDataSourceContainer extends HashMap<ImportType, ArticleDataSource> {

}
