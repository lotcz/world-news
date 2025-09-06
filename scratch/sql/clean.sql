/* reschedule articles in Error for reprocessing */
UPDATE article set processing_state = 'Waiting' WHERE processing_state <> 'Waiting';
UPDATE article set processing_state = 'Waiting' WHERE processing_state IN ('Error', 'Processing');

/* reschedule topics in Error for reprocessing */
UPDATE topic set processing_state = 'Waiting' WHERE processing_state IN ('Error', 'Processing');

/* reset all realm */
UPDATE topic SET realm_id = NULL WHERE realm_id IS NOT NULL;

/* delete topics with no articles */
DELETE FROM topic WHERE article_count = 0;

/* set article publish date */
UPDATE article SET publish_date = '2025-08-01 00:00:00' WHERE publish_date IS NULL;

/* delete duplicate articles */
DELETE FROM article
WHERE id IN (
	SELECT a1.id
	FROM article a1
	JOIN article a2 on (a2.title = a1.title)
	AND a1.id > a2.id
);


/* TOTAL CLEANUP! */
DELETE FROM topic WHERE 1=1;
DELETE FROM article WHERE 1=1;
DELETE FROM ai_log WHERE 1=1;
