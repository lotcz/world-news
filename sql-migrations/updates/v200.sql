DROP TABLE article_tag;
DROP TABLE tag;

create table country (
    id integer primary key GENERATED ALWAYS AS IDENTITY,
    created_on timestamp(6) with time zone NOT NULL default CURRENT_TIMESTAMP,
    last_updated_on timestamp(6) with time zone NOT NULL default CURRENT_TIMESTAMP,
    name varchar(255),
    create_overview boolean not null default false
);

INSERT INTO country (name, create_overview) VALUES ('ČR', true);

alter table article_source add column country_id integer;
UPDATE article_source SET country_id = (select id from country limit 1);
alter table article_source alter column country_id set not null;
alter table article_source add constraint fk_article_source_country_id foreign key (country_id) references country;

alter table topic add column country_id integer;
UPDATE topic SET country_id = (select id from country limit 1);
alter table topic add constraint fk_topic_country_id foreign key (country_id) references country;

