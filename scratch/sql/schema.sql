create type tp_entity_type AS ENUM ('Article', 'Topic');
create cast	(varchar AS tp_entity_type) WITH INOUT AS IMPLICIT;

alter type tp_entity_type add value IF NOT EXISTS 'Realm';

create type tp_operation AS ENUM ('CreateTitle', 'CreateSummary');
create cast	(varchar AS tp_operation) WITH INOUT AS IMPLICIT;

alter type tp_operation add value IF NOT EXISTS 'DetectTags';
alter type tp_operation add value IF NOT EXISTS 'CompileArticles';
alter type tp_operation add value IF NOT EXISTS 'DetectRealm';

create table ai_log (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone NOT NULL default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone NOT NULL default CURRENT_TIMESTAMP,
    entity_id integer,
    entity_type tp_entity_type,
    operation tp_operation,
    response text,
    system_prompt text,
    temperature double precision not null,
    user_prompt text,
    model varchar(100)
);

create index idx_ai_log_created_on
    on ai_log (created_on desc);

create index idx_ai_log_entity
    on ai_log (entity_type, entity_id, created_on desc);

create index idx_ai_log_operation
    on ai_log (operation, created_on desc);

create table language (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    name varchar(255),
    code varchar(5),
    ai_system_prompt text,
	ai_user_prompt_create_title text,
	ai_user_prompt_create_summary text,
	ai_user_prompt_detect_tags text,
	ai_user_prompt_compile_articles text
);

ALTER TABLE language
ALTER COLUMN name TYPE VARCHAR(255) COLLATE "en_US.utf8";

create unique index idx_language_name
    on language (name);

create unique index idx_language_code
    on language (code);

create type tp_import_type AS ENUM ('Unknown', 'Rss', 'Internal');
create cast	(varchar AS tp_import_type) WITH INOUT AS IMPLICIT;

create table article_source (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    processing_state tp_processing_state not null default 'NotReady',
    name varchar(255),
    import_type tp_import_type not null,
    last_imported timestamp(6) with time zone,
    url varchar(255),
    language_id integer not null
    	constraint fk_article_source_language
       	references language,
    filter_out text,
    article_count int not null default 0
);

ALTER TABLE article_source
ALTER COLUMN name TYPE VARCHAR(255) COLLATE "en_US.utf8";

create index idx_article_last_imported
    on article_source (last_imported);

create table realm (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    parent_id integer
    	constraint fk_realm_parent
       	references realm,
    name varchar(255),
    approved boolean not null default false,
    summary text
);

ALTER TABLE realm
ALTER COLUMN name TYPE VARCHAR(255) COLLATE "en_US.utf8";

create index idx_realm_name
    on realm (name);

create table article_source_realm (
    article_source_id integer not null
        constraint fkcp59ajplvu3i1n32fmegft0lf
        references article_source,
    realm_id integer not null
        constraint fk3jhg2gwueixnef316q0q8q6k0
            references realm,
    primary key (article_source_id, realm_id)
);

create table tag (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    name varchar(255) not null,
    article_count int not null default 0,
    language_id integer not null
    	constraint fk_tag_language
       	references language,
    synonym_of_id integer
        constraint fkqv68mmko7bkuu53wnoo57ou52
        references tag
);

ALTER TABLE tag
ALTER COLUMN name TYPE VARCHAR(255) COLLATE "en_US.utf8";

create unique index idx_tag_name
    on tag (language_id, name);

create index idx_tag_synonym
    on tag (synonym_of_id);

create type tp_processing_state AS ENUM ('NotReady', 'Waiting', 'Processing', 'Done', 'Error');
create cast	(varchar AS tp_processing_state) WITH INOUT AS IMPLICIT;

create table topic (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    name varchar(255),
    realm_id integer
        constraint fk2c5koqvpw2aylwd4yhrr9cjer
        references realm,
	language_id integer not null
        constraint fk_topic_language
        references language,
    processing_state tp_processing_state not null default 'NotReady',
    summary text,
    article_count int not null default 0
);

ALTER TABLE topic
ALTER COLUMN name TYPE VARCHAR(255) COLLATE "en_US.utf8";

create index idx_topic_processing_state
    on topic (processing_state, article_count);

create table article (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    body text,
    original_url varchar(255),
    original_uid varchar(255),
    processing_state tp_processing_state not null default 'NotReady',
    publish_date timestamp(6) with time zone,
    summary text,
    title varchar(255),
    language_id integer not null
        constraint fkntjo7u9ep5digg27txr8fnqa5
        references language,
    source_id integer not null
        constraint fk76ghi213is4pqftv2cjg96box
        references article_source
        on delete cascade,
    topic_id integer
        constraint fk6x3cr4vpqhjktvuju4u1f77q1
        references topic
);

ALTER TABLE article
ALTER COLUMN title TYPE VARCHAR(255) COLLATE "en_US.utf8";

create index idx_article_created_on
    on article (created_on desc);

create index idx_article_processing_state
    on article (processing_state, last_updated_on desc);

create unique index idx_article_original_url
    on article (original_url);

create index idx_article_original_uid
    on article (original_uid);

create index idx_article_topic
    on article (topic_id);

create index idx_article_source
    on article (source_id);

create table article_tag (
    article_id integer not null
        constraint fkenqeees0y8hkm7x1p1ittuuye
        references article
        on delete cascade,
    tag_id integer not null
        constraint fkesqp7s9jj2wumlnhssbme5ule
        references tag
        on delete cascade,
    primary key (article_id, tag_id)
);

create index idx_article_tag_tag_id
    on article_tag (tag_id);


create table image (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    description varchar(255),
    original_url varchar(255),
    path varchar(255),
    article_id integer
        constraint fkj1itl8jvakcxyqmrq91bmp49u
        references article
        on delete cascade
);

create table article_image (
    article_id integer not null
        constraint fkt3rm1gwoysmll8kpy7lt1vpwc
        references article
        on delete cascade,
    image_id integer not null
        constraint fkt9nr91sf73hmdyvejuqwvobnt
        references image
        on delete cascade,
    primary key (article_id, image_id)
);
