INSERT INTO language (name, code)
VALUES ('Čeština', 'cs');

update language set ai_system_prompt = 'Jsi redaktor v online časopise, který čte, zpracovává a píše články a jiné zpravodajské texty.
Na zadání odpovídej vždy česky ve formě čistého textu bez markdown formátování.'
where code = 'cs';

update language set ai_user_prompt_create_title = 'Vymysli titulek pro následující článek:'
where code = 'cs';

update language set ai_user_prompt_create_summary = 'Zkrať na jeden odstavec shrnující nejdůležitější informace v textu:'
where code = 'cs';

update language set ai_user_prompt_detect_tags = 'Najdi nejdůležitější klíčová slova a vypíš je vždy v 1. pádu oddělené čárkou.
Stačí jen pět těch opravdu nejdůležitějších - budou použity jako tagy pro kategorizaci obsahu:'
where code = 'cs';

update language set ai_user_prompt_compile_articles = 'Zde je několik článků na stejné téma. Napiš vlastními slovy úplně nový článek jejich sloučením.
Výsledný článek musí pokrývat všechny klíčové informace obsažené ve zdrojových článcích, ale může používat vlastní formulace a vypadat jako úplně nový:'
where code = 'cs';

INSERT INTO language (name, code)
VALUES ('English', 'en');

update language set ai_system_prompt = 'You are an editor in an online magazine who reads, processes, and writes articles and other news texts.
Always respond to assignments in English, in plain text without markdown formatting.'
where code = 'en';

update language set ai_user_prompt_create_title = 'Come up with a title for following article:'
where code = 'en';

update language set ai_user_prompt_create_summary = 'Shorten to a single paragraph covering the most important points in the text:'
where code = 'en';

update language set ai_user_prompt_detect_tags = 'Find the most important keywords and list them always in the nominative case, separated by commas.
Only five of the really most important ones are enough – they will be used as tags for content categorization:'
where code = 'en';

update language set ai_user_prompt_compile_articles = 'Here are several articles on the same topic. Write a completely new article in your own words by merging them.
The resulting article must cover all the key information contained in the source articles, but it may use your own phrasing and should look like a completely new one:'
where code = 'en';

INSERT INTO article_source (name, import_type, url, language_id)
VALUES ('seznam', 'Rss', 'https://www.seznamzpravy.cz/rss', 1);

INSERT INTO article_source (name, import_type, url, language_id)
VALUES ('novinky', 'Rss', 'https://www.novinky.cz/rss', 1);

INSERT INTO article_source (name, import_type, url, language_id)
VALUES ('aktualne', 'Rss', 'https://www.aktualne.cz/rss', 1);
