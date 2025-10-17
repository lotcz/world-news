drop index idx_topic_load_compilation_queue;

create index idx_topic_load_compilation_queue
    on topic (processing_state, article_type, is_locked, external_articles_source_count);

drop index idx_article_original_url;

alter table article alter column original_url type text;
