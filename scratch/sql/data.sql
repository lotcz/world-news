INSERT INTO language (name, code)
VALUES ('Čeština', 'cs');

INSERT INTO article_source (name, import_type, url, language_id)
VALUES ('seznam', 'Rss', 'https://www.seznamzpravy.cz/rss', 1);

INSERT INTO article_source (name, import_type, url, language_id)
VALUES ('novinky', 'Rss', 'https://www.novinky.cz/rss', 1);

INSERT INTO article_source (name, import_type, url, language_id)
VALUES ('aktualne', 'Rss', 'https://www.aktualne.cz/rss', 1);
