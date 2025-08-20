/* reschedule articles in Error for reprocessing */
UPDATE article set processing_state = 'Waiting' WHERE processing_state = 'Error';

/* delete duplicate articles */
DELETE FROM article
WHERE id IN (
	SELECT a1.id
	FROM article a1
	JOIN article a2 on (a2.original_url = a1.original_url)
	AND a1.id > a2.id
);
