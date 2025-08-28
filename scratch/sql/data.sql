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

/*
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Yahoo', 'Rss', 'https://www.yahoo.com/news/rss', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Politico.COM - politics', 'Rss', 'https://rss.politico.com/politics-news.xml', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('New York Times', 'Rss', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Super.cz', 'Rss', 'http://super.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('ParlamentniListy', 'Rss', 'https://www.parlamentnilisty.cz/export/rss.aspx', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('ČT24', 'Rss', 'https://ct24.ceskatelevize.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Politico.EU', 'Rss', 'https://www.politico.eu/rss', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Deník N', 'Rss', 'https://denikn.cz/rss/', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Euronews', 'Rss', 'https://www.euronews.com/rss', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('ProŽeny.cz', 'Rss', 'https://prozeny.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Hospodářské noviny', 'Rss', 'https://hn.cz/?m=rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('iDNES', 'Rss', 'https://servis.idnes.cz/rss.aspx?c=zpravodaj', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Aktualne.cz', 'Rss', 'https://www.aktualne.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Echo24', 'Rss', 'https://www.echo24.cz/rss/s/homepage', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Blesk', 'Rss', 'https://www.blesk.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Seznam Zprávy', 'Rss', 'https://www.seznamzpravy.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Novinky.cz', 'Rss', 'https://www.novinky.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('CNN Prima', 'Rss', 'https://cnn.iprima.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Denik.cz', 'Rss', 'https://www.denik.cz/rss/zpravy.html', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('CNN.com', 'Rss', 'http://rss.cnn.com/rss/cnn_latest.rss', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Forum24', 'Rss', 'https://www.forum24.cz/feed', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Extra.cz', 'Rss', 'https://www.extra.cz/rss.xml', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Fox News', 'Rss', 'https://moxie.foxnews.com/google-publisher/latest.xml', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('NBC News', 'Rss', 'https://feeds.nbcnews.com/nbcnews/public/news', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('ČTK', 'Rss', 'https://www.protext.cz/rss/cz.php', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('LA Times', 'Rss', 'https://www.latimes.com/local/rss2.0.xml', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Internal', 'Internal', null, 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Rozhlas', 'Rss', 'https://www.irozhlas.cz/rss/irozhlas', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Drbna.cz', 'Rss', 'https://www.drbna.cz/rss.html', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('TN.cz', 'Rss', 'https://tn.nova.cz/rss', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('České noviny - domaci', 'Rss', 'https://www.ceskenoviny.cz/sluzby/rss/cr.php', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('České noviny - sport', 'Rss', 'https://www.ceskenoviny.cz/sluzby/rss/sport.php', 1);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('BBC', 'Rss', 'https://feeds.bbci.co.uk/news/rss.xml', 34);
INSERT INTO public.article_source (name, import_type, url, language_id) VALUES ('Lidovky.cz', 'Rss', 'https://servis.lidovky.cz/rss.aspx', 1);


 */
