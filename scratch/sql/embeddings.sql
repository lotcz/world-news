CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS article_embeddings;

create table article_embeddings (
    hash varchar(32) not null primary key,
    article_id integer not null
    	constraint fk_article_embeddings_article
        references article
        on delete cascade,
    embedding vector(1536) not null
);

DROP INDEX IF EXISTS article_embeddings_article_ix;

CREATE INDEX article_embeddings_article_ix ON article_embeddings (article_id);

DROP INDEX IF EXISTS article_embeddings_vector_ix;

CREATE INDEX article_embeddings_vector_ix
	ON article_embeddings
	USING ivfflat (embedding vector_cosine_ops)
	WITH (lists = 100);


DROP TABLE IF EXISTS topic_embeddings;

CREATE TABLE topic_embeddings (
	hash VARCHAR(32) PRIMARY KEY,
	topic_id int not null,
	embedding vector(1536) not null
);

DROP INDEX IF EXISTS topic_embeddings_topic_ix;

CREATE INDEX topic_embeddings_topic_ix ON topic_embeddings (topic_id);

DROP INDEX IF EXISTS topic_embeddings_vector_ix;

CREATE INDEX topic_embeddings_vector_ix
	ON topic_embeddings
		USING ivfflat (embedding vector_cosine_ops)
	WITH (lists = 100);
