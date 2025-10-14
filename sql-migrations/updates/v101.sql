alter table image add column source_url varchar(255);
alter table image add column author_url varchar(255);
alter table image add column original_width int;
alter table image add column original_height int;

create type tp_vertical_align AS ENUM ('Top', 'Center', 'Bottom');
create cast	(varchar AS tp_vertical_align) WITH INOUT AS IMPLICIT;

create type tp_horizontal_align AS ENUM ('Left', 'Center', 'Right');
create cast	(varchar AS tp_horizontal_align) WITH INOUT AS IMPLICIT;

alter table image add column vertical_align tp_vertical_align;
alter table image add column horizontal_align tp_horizontal_align;

alter table topic add column external_articles_source_count int not null default 0;
alter table article add column used_for_compilation boolean not null default false;
alter table topic add column external_articles_unused_count int not null default 0;

/* topic's article count */

CREATE OR REPLACE PROCEDURE update_topic_article_count(p_topic_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE topic t
    SET article_count_internal = (
        SELECT COUNT(*)
        FROM article a
        WHERE a.source_id IN (select id from article_source where import_type = 'Internal')
        	AND a.topic_id = p_topic_id
    ),
    article_count_external = (
        SELECT COUNT(*)
        FROM article a
        WHERE a.source_id NOT IN (select id from article_source where import_type = 'Internal')
        	AND a.topic_id = p_topic_id
    ),
    external_articles_source_count = (
        SELECT COUNT(distinct a.source_id)
        FROM article a
        WHERE a.source_id NOT IN (select id from article_source where import_type = 'Internal')
        	AND a.topic_id = p_topic_id
    ),
    external_articles_unused_count = (
        SELECT COUNT(*)
        FROM article a
        WHERE a.source_id NOT IN (select id from article_source where import_type = 'Internal')
        	AND a.used_for_compilation = false
        	AND a.topic_id = p_topic_id
    )
    WHERE t.id = p_topic_id;
END;
$$;

update article set used_for_compilation = true;

DO $$
DECLARE
    r topic%ROWTYPE;
BEGIN
    FOR r IN SELECT id FROM topic LOOP
        CALL update_topic_article_count(r.id);
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION article_inserted_or_updated()
RETURNS TRIGGER AS $$
BEGIN
	IF TG_OP = 'DELETE' THEN
        CALL update_topic_article_count(OLD.topic_id);
        CALL update_source_article_count(OLD.source_id);
    ELSEIF TG_OP = 'INSERT' THEN
        CALL update_topic_article_count(NEW.topic_id);
        CALL update_source_article_count(NEW.source_id);
    ELSE
		IF (OLD.topic_id IS DISTINCT FROM NEW.topic_id) THEN
			CALL update_topic_article_count(OLD.topic_id);
			CALL update_topic_article_count(NEW.topic_id);
		ELSEIF (OLD.source_id IS DISTINCT FROM NEW.source_id OR OLD.used_for_compilation IS DISTINCT FROM NEW.used_for_compilation) THEN
			CALL update_topic_article_count(NEW.topic_id);
		END IF;
		IF (OLD.source_id IS DISTINCT FROM NEW.source_id) THEN
			CALL update_source_article_count(OLD.source_id);
			CALL update_source_article_count(NEW.source_id);
		END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_article_count
AFTER DELETE OR INSERT OR UPDATE ON article
FOR EACH ROW EXECUTE FUNCTION article_inserted_or_updated();
