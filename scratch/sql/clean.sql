/* reschedule articles in Error for reprocessing */
UPDATE article set processing_state = 'Waiting' WHERE processing_state IN ('Error', 'Processing');

/* reset all topics */
UPDATE article SET topic_id = NULL WHERE topic_id IS NOT NULL;
DELETE FROM topic WHERE 1=1;
UPDATE article set processing_state = 'Waiting' WHERE processing_state <> 'Waiting';

/* delete topics with no articles */
DELETE FROM topic WHERE article_count = 0;

/* delete duplicate articles */
DELETE FROM article
WHERE id IN (
	SELECT a1.id
	FROM article a1
	JOIN article a2 on (a2.title = a1.title)
	AND a1.id > a2.id
);
