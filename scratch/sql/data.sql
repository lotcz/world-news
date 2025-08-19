CREATE EXTENSION IF NOT EXISTS vector;

INSERT INTO language (id, created_on, last_updated_on, name, code) VALUES (1, null, null, 'Čeština', 'cs');

INSERT INTO article_source (id, created_on, last_updated_on, name, import_type, last_imported, url, language_id) VALUES (2, null, '2025-08-18 15:58:20.878638 +00:00', 'seznam', 1, '2025-08-18 15:58:20.878112 +00:00', 'https://www.seznamzpravy.cz/rss', 1);
INSERT INTO article_source (id, created_on, last_updated_on, name, import_type, last_imported, url, language_id) VALUES (1, null, '2025-08-18 15:58:38.523079 +00:00', 'novinky', 1, '2025-08-18 15:58:38.522045 +00:00', 'https://www.novinky.cz/rss', 1);
INSERT INTO article_source (id, created_on, last_updated_on, name, import_type, last_imported, url, language_id) VALUES (3, null, '2025-08-18 15:58:56.843658 +00:00', 'aktualne', 1, '2025-08-18 15:58:56.843139 +00:00', 'https://www.aktualne.cz/rss', 1);
