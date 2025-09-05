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
    )
    WHERE t.id = p_topic_id;
END;
$$;

DO $$
DECLARE
    r topic%ROWTYPE;
BEGIN
    FOR r IN SELECT id FROM topic LOOP
        CALL update_topic_article_count(r.id);
    END LOOP;
END;
$$;

/* source's article count */

CREATE OR REPLACE PROCEDURE update_source_article_count(p_source_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE article_source ars
    SET article_count = (
        SELECT COUNT(*) FROM article a WHERE a.source_id = p_source_id
    )
    WHERE ars.id = p_source_id;
END;
$$;

DO $$
DECLARE
    ars article_source%ROWTYPE;
BEGIN
    FOR ars IN SELECT id FROM article_source LOOP
        CALL update_source_article_count(ars.id);
    END LOOP;
END;
$$;

/* tag's article count */

CREATE OR REPLACE PROCEDURE update_tag_article_count(p_tag_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE tag t
    SET article_count = (
        SELECT COUNT(*) FROM article_tag at WHERE at.tag_id = p_tag_id
    )
    WHERE t.id = p_tag_id;
END;
$$;

DO $$
DECLARE
    t tag%ROWTYPE;
BEGIN
    FOR t IN SELECT id FROM tag LOOP
        CALL update_tag_article_count(t.id);
    END LOOP;
END;
$$;

/* article changed trigger */

CREATE OR REPLACE FUNCTION article_inserted_or_updated()
RETURNS TRIGGER AS $$
BEGIN
	IF TG_OP = 'DELETE' THEN
        CALL update_topic_article_count(OLD.topic_id);
        CALL update_source_article_count(OLD.source_id);
    ELSEIF TG_OP = 'INSERT' THEN
        CALL update_topic_article_count(NEW.topic_id);
        CALL update_source_article_count(NEW.source_id);
    ELSIF (OLD.topic_id IS DISTINCT FROM NEW.topic_id) THEN
        CALL update_topic_article_count(OLD.topic_id);
        CALL update_topic_article_count(NEW.topic_id);
        CALL update_source_article_count(OLD.source_id);
        CALL update_source_article_count(NEW.source_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_article_count
AFTER DELETE OR INSERT OR UPDATE ON article
FOR EACH ROW EXECUTE FUNCTION article_inserted_or_updated();

/* article-tag changed trigger */

CREATE OR REPLACE FUNCTION article_tag_inserted_or_updated()
RETURNS TRIGGER AS $$
BEGIN
	IF TG_OP = 'DELETE' THEN
        CALL update_tag_article_count(OLD.tag_id);
    ELSEIF TG_OP = 'INSERT' THEN
        CALL update_tag_article_count(NEW.tag_id);
    ELSIF (OLD.tag_id IS DISTINCT FROM NEW.tag_id) THEN
        CALL update_tag_article_count(OLD.tag_id);
        CALL update_tag_article_count(NEW.tag_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_article_tag_count
AFTER DELETE OR INSERT OR UPDATE ON article_tag
FOR EACH ROW EXECUTE FUNCTION article_tag_inserted_or_updated();

/* realm's topic count */

CREATE OR REPLACE PROCEDURE update_realm_topic_count(p_realm_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE realm r
    SET topic_count = (
        SELECT COUNT(*) FROM topic t WHERE t.realm_id = p_realm_id
    )
    WHERE r.id = p_realm_id;
END;
$$;

DO $$
DECLARE
    r realm%ROWTYPE;
BEGIN
    FOR r IN SELECT id FROM realm LOOP
        CALL update_realm_topic_count(r.id);
    END LOOP;
END;
$$;

/* topic changed trigger */

CREATE OR REPLACE FUNCTION topic_inserted_or_updated()
RETURNS TRIGGER AS $$
BEGIN
	IF TG_OP = 'DELETE' AND OLD.realm_id IS NOT NULL THEN
        CALL update_realm_topic_count(OLD.realm_id);
    ELSEIF TG_OP = 'INSERT' AND NEW.realm_id IS NOT NULL THEN
        CALL update_realm_topic_count(NEW.realm_id);
    ELSIF (OLD.realm_id IS DISTINCT FROM NEW.realm_id) THEN
        CALL update_realm_topic_count(OLD.realm_id);
        CALL update_realm_topic_count(NEW.realm_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_realm_topic_count
AFTER DELETE OR INSERT OR UPDATE ON topic
FOR EACH ROW EXECUTE FUNCTION topic_inserted_or_updated();
