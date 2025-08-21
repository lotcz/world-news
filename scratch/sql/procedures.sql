DROP PROCEDURE update_topic_article_count(integer);

CREATE OR REPLACE PROCEDURE update_topic_article_count(p_topic_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE topic t
    SET article_count = (
        SELECT COUNT(*) FROM article a WHERE a.topic_id = p_topic_id
    )
    WHERE t.id = p_topic_id;
END;
$$;

CREATE OR REPLACE FUNCTION article_inserted_or_updated()
RETURNS TRIGGER AS $$
BEGIN
	IF TG_OP = 'INSERT' THEN
        CALL update_topic_article_count(NEW.topic_id);
    ELSIF (OLD.topic_id IS DISTINCT FROM NEW.topic_id) THEN
        CALL update_topic_article_count(OLD.topic_id);
        CALL update_topic_article_count(NEW.topic_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_article_count
AFTER INSERT OR UPDATE ON article
FOR EACH ROW EXECUTE FUNCTION article_inserted_or_updated();

DO $$
DECLARE
    r topic%ROWTYPE;
BEGIN
    FOR r IN SELECT id FROM topic LOOP
        CALL update_topic_article_count(r.id);
    END LOOP;
END;
$$;
