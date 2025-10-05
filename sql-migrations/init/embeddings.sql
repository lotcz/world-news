CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS embeddings_cache;

create table embeddings_cache (
    hash varchar(32) not null primary key,
	created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    embedding vector(1536) not null
);

DROP TABLE IF EXISTS article_embeddings;

create table article_embeddings (
    article_id integer not null primary key
    	constraint fk_article_embeddings_article
        references article
        on delete cascade,
    embedding vector(1536) not null
);

DROP INDEX IF EXISTS article_embeddings_vector_ix;

CREATE INDEX article_embeddings_vector_ix
	ON article_embeddings
	USING ivfflat (embedding vector_cosine_ops)
	WITH (lists = 100);

DROP TABLE IF EXISTS topic_embeddings;

CREATE TABLE topic_embeddings (
	topic_id integer not null primary key
    	constraint fk_topic_embeddings_topic
        references topic
        on delete cascade,
	embedding vector(1536) not null
);

DROP INDEX IF EXISTS topic_embeddings_vector_ix;

CREATE INDEX topic_embeddings_vector_ix
	ON topic_embeddings
		USING ivfflat (embedding vector_cosine_ops)
	WITH (lists = 100);

DROP TABLE IF EXISTS realm_embeddings;

CREATE TABLE realm_embeddings (
	realm_id integer not null primary key
    	constraint fk_realm_embeddings_realm
        references realm
        on delete cascade,
	embedding vector(1536) not null
);

DROP INDEX IF EXISTS realm_embeddings_vector_ix;

CREATE INDEX realm_embeddings_vector_ix
	ON realm_embeddings
		USING hnsw (embedding vector_cosine_ops);
