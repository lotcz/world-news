INSERT INTO language (name, code)
VALUES ('Čeština', 'cs');

update language set ai_system_prompt = 'Jsi redaktor v online časopise, který čte, zpracovává a píše články a jiné zpravodajské texty.
Na zadání odpovídej vždy česky ve formě čistého textu bez markdown formátování.'
where code = 'cs';

update language set ai_user_prompt_create_title = 'Vymysli titulek pro následující článek:'
where code = 'cs';

update language set ai_user_prompt_create_summary = 'Zkrať na jeden odstavec shrnující nejdůležitější informace v textu:'
where code = 'cs';

update language set ai_user_prompt_detect_tags = 'Najdi nejdůležitější klíčová slova a vypiš je vždy v 1. pádu oddělené čárkou.
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

INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Seznam Zprávy', 'Rss', '2025-10-02 17:45:47.873851 +00:00', 'https://www.seznamzpravy.cz/rss', 1, 'Článek si také můžete poslechnout v audioverzi.', 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Novinky.cz', 'Rss', '2025-10-02 17:45:54.218661 +00:00', 'https://www.novinky.cz/rss', 1, null, 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Aktualne.cz', 'Rss', '2025-10-02 17:45:35.637645 +00:00', 'https://www.aktualne.cz/rss', 1, null, 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('ČT24', 'Rss', '2025-09-05 15:52:55.875537 +00:00', 'https://ct24.ceskatelevize.cz/rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Deník N', 'Rss', '2025-09-16 21:30:30.123913 +00:00', 'https://denikn.cz/rss/', 1, null, 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('České noviny - domaci', 'Rss', '2025-09-05 15:53:06.115871 +00:00', 'https://www.ceskenoviny.cz/sluzby/rss/cr.php', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('České noviny - sport', 'Rss', '2025-09-05 15:53:12.016477 +00:00', 'https://www.ceskenoviny.cz/sluzby/rss/sport.php', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Internal', 'Internal', null, null, 1, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('BBC', 'Rss', '2025-09-05 15:53:18.555050 +00:00', 'https://feeds.bbci.co.uk/news/rss.xml', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Denik.cz', 'Rss', '2025-09-05 15:53:22.492993 +00:00', 'https://www.denik.cz/rss/zpravy.html', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('CNN.com', 'Rss', '2025-09-05 15:53:49.824642 +00:00', 'http://rss.cnn.com/rss/cnn_latest.rss', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('NBC News', 'Rss', '2025-09-05 15:54:00.478740 +00:00', 'https://feeds.nbcnews.com/nbcnews/public/news', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('ČTK', 'Rss', '2025-09-05 15:54:05.069150 +00:00', 'https://www.protext.cz/rss/cz.php', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Politico.EU', 'Rss', '2025-09-05 15:54:05.367697 +00:00', 'https://www.politico.eu/rss', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Politico.COM - politics', 'Rss', '2025-09-05 15:54:06.009443 +00:00', 'https://rss.politico.com/politics-news.xml', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Super.cz', 'Rss', '2025-09-05 15:54:12.955225 +00:00', 'http://super.cz/rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('ProŽeny.cz', 'Rss', '2025-09-05 15:54:23.004781 +00:00', 'https://prozeny.cz/rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('New York Times', 'Rss', '2025-08-28 19:04:13.461000 +00:00', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 2, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Fox News', 'Rss', '2025-09-05 15:54:23.518821 +00:00', 'https://moxie.foxnews.com/google-publisher/latest.xml', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Yahoo', 'Rss', '2025-09-05 15:54:48.218187 +00:00', 'https://www.yahoo.com/news/rss', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('LA Times', 'Rss', '2025-09-05 15:55:17.620142 +00:00', 'https://www.latimes.com/local/rss2.0.xml', 2, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('iDNES', 'Rss', null, 'https://servis.idnes.cz/rss.aspx?c=zpravodaj', 1, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Lidovky.cz', 'Rss', null, 'https://servis.lidovky.cz/rss.aspx', 1, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Echo24', 'Rss', '2025-09-05 15:29:36.138317 +00:00', 'https://www.echo24.cz/rss/s/homepage', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Rozhlas', 'Rss', '2025-09-05 15:29:37.735463 +00:00', 'https://www.irozhlas.cz/rss/irozhlas', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Hospodářské noviny', 'Rss', '2025-09-05 15:51:17.783614 +00:00', 'https://hn.cz/?m=rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Blesk', 'Rss', '2025-09-05 15:51:55.23720 +00:00', 'https://www.blesk.cz/rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('TN.cz', 'Rss', '2025-09-05 15:52:07.000971 +00:00', 'https://tn.nova.cz/rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('CNN Prima', 'Rss', '2025-09-05 15:52:07.323764 +00:00', 'https://cnn.iprima.cz/rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Forum24', 'Rss', '2025-09-05 15:52:12.308507 +00:00', 'https://www.forum24.cz/feed', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Drbna.cz', 'Rss', '2025-09-04 11:13:43.183000 +00:00', 'https://www.drbna.cz/rss.html', 1, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Extra.cz', 'Rss', '2025-09-05 15:52:13.679846 +00:00', 'https://www.extra.cz/rss.xml', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Euronews', 'Rss', '2025-09-05 01:19:23.437709 +00:00', 'https://www.euronews.com/rss', 2, null, 'Processing', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Respekt', 'Rss', '2025-09-04 13:15:56.635000 +00:00', 'https://www.respekt.cz/api/rss?type=articles&unlocked=1', 1, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('IGN', 'Rss', '2025-09-06 11:55:48.481241 +00:00', 'https://cz.ign.com/feed.xml', 2, null, 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Konzervativni Noviny', 'Rss', '2025-09-04 11:54:18.223000 +00:00', 'https://konzervativninoviny.cz/rss', 1, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Visiongame', 'Rss', '2025-09-06 12:09:55.776102 +00:00', 'https://visiongame.cz/rss', 1, null, 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Manipulátoři', 'Rss', '2025-09-05 15:52:41.968923 +00:00', 'https://manipulatori.cz/rss', 1, null, 'Waiting', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Ekonom.cz', 'Rss', null, 'https://ekonom.cz/?m=rss', 1, null, 'NotReady', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('PC Gamer', 'Rss', '2025-09-06 11:55:38.163202 +00:00', 'https://www.pcgamer.com/feeds.xml', 2, null, 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Eurogamer', 'Rss', '2025-09-06 11:54:15.096071 +00:00', 'https://www.eurogamer.net/rss', 2, null, 'Done', null, null);
INSERT INTO article_source (name, import_type, last_imported, url, language_id, filter_out_text, processing_state, limit_to_element, exclude_elements) VALUES ('Tiscali', 'Rss', '2025-09-06 12:11:32.674297 +00:00', 'https://feeds.feedburner.com/tiscali-zpravy-box', 1, null, 'Done', null, null);

delete from realm where parent_id is null;

INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (41, 'Kriminalita a zločin', 'Kriminalita a zločin, trestná činnost, vraždy, krádeže, znásilnění, soudy, policie, pohřešované osoby, zbraně, drogy', null, false, '2025-09-30 15:35:57.177000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (58, 'Uncategorized', null, null, true, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (21, 'Politika', 'Politika, politics', null, false, '2025-09-29 19:53:24.665000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (20, 'Sport', 'Sport, sportovci, utkání, zápasy, sportovní výsledky', null, false, '2025-09-29 21:49:19.328000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (28, 'Příroda', 'Příroda', null, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (22, 'Věda a technika', 'Věda a technika, science and technology', null, false, '2025-09-29 21:49:42.661000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (56, 'Móda', e'Móda a elegance, módní značky, modelky

Armani, Karl Lagerfeld', null, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (11, 'Kultura', 'Události z kultury. Hudba, divadlo, výtvarné umění, nový cirkus', null, false, '2025-09-29 19:55:29.417000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (30, 'Zdraví', 'Péče o zdraví, medicína, lékařství, léky, drogy a závislosti, nemoci, porodnost', null, false, '2025-10-03 01:42:35.283000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (60, 'Počasí', 'Počasí, déšť, bouřky, vítr, sníh, horko, zima', null, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (24, 'Bulvár', 'Bulvár, šokující a překvapivé skandály celebrit, influenceři, reality show, vztahy a rozchody, pomluvy', null, false, '2025-09-29 19:56:38.209000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (42, 'Nehody a katastrofy', 'Nehody a katastrofy, autonehody, pád letadla, neštěstí, přírodní katastrofy, povodně, požáry', null, false, '2025-09-30 15:17:13.610000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (26, 'Ekonomika a business', 'Ekonomika, business a podnikání, podnikatelé, majitelé miliardáři, CEO, ředitelé podniků. Obchodování na burze, trading, akcie, dluhopisy', null, false, '2025-09-29 21:49:35.974000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (35, 'Fitness', 'Fitness, zdravá strava, cvičení, hubnutí, zdravý životní styl', 30, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (29, 'Ekologie a ochrana přírody', 'Ekologie a ochrana přírody. Dekarbonizace, uhlíková neutralita, klimatická změna, emise oxidu uhličitého, elekromobily. Ohrožené druhy.', 28, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (66, 'Britská královská rodina', 'Britská královská rodina, Karel II., Edward, Buckinghamský palác', 24, false, '2025-10-01 00:43:26.061000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (39, 'Tabloid', 'Tabloid, shocking news, scandals, celebrities, fame', 24, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (62, 'Internet a sociální sítě', e'Internet a sociální sítě

Youtube, Facebook, TikTok, Instagram, Twitter, X.com', 22, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (27, 'Vesmír', e'Astronomie a průzkum vesmíru, vesmírné technologie, zatmění, oběžná dráha

Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun, Titan

NASA, ESA, SpaceX, Blue Origin', 22, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (44, 'Výpočetní technika', e'Výpočetní technika, počítače, CPU, GPU, USB

Společnost Apple, iPhone, Macbook, Intel, NVidia, Acer, Asus, Hewlett Packard, Google, Android', 22, false, '2025-09-30 15:10:29.343000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (23, 'AI', 'AI a umělá inteligence. Strojové učení, LLMs (velké jazykové modely). OpenAI, ChatGPT, Anthropic, Claude, Google Gemini.', 22, false, '2025-10-02 19:42:46.503000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (32, 'Historie', 'Historie, dějiny, archeologie, výzkum, století, pozůstatky, památky, vykopávky', 22, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (6, 'Česká politika', e'Události v české politice. Zprávy z parlamentu - poslanecké sněmovny i senátu. Vláda, ministři, náměstci. Politické strany a hnutí, politici. Státní rozpočet ČR.

Andrej Babiš, Petr Fiala, Petr Pavel', 21, false, '2025-09-29 19:55:09.439000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (37, 'Geopolitika', e'Světová politika, World politics, geopolitika, geopolitics

American politics, Donald Trump, Elon Musk, Bernie Sanders

Russian politics, Vladimir Putin, Dmitrij Medvedev, Sergej Lavrov

Nicolás Maduro, Xi Tinping

Chinese politics, Si Ťin-pching, Xi Jinping', 21, false, '2025-09-30 00:12:14.154000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (68, 'Migrace', 'Imigrace, přistěhovalectví, kontrola hranic', 37, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (57, 'Rusko-ukrajinský konflikt', e'Rusko-ukrajinský konflikt, útok Ruska na Ukrajinu, Vladimir Putin, Volodymir Zelenskyj

Krym, Donbas, Kyjev', 37, false, '2025-09-30 00:12:17.735000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (67, 'Venezuela', e'Venezuela, napětí mezi Spojenými Státy a Venezuelou

Caracas, Nicolas Maduro', 37, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (64, 'Britská politika', e'Britská politika, labour party, conservative party, tory

Keir Starmer', 21, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (63, 'Americká politika', e'Americká politika, USA, gerrymandering

Donald Trump, Kamala Harris, Elon Musk, Joe Biden, Barack Obama', 21, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (40, 'Evropská unie', 'EU, European Union. Události v zemích Evropské unie. Europarlament, Brusel.', 21, false, '2025-09-30 15:38:08.152000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (31, 'Izraelsko-palestinský konflikt', 'Izraelsko-palestinský konflikt', 21, false, '2025-10-01 23:16:45.326000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (36, 'Fotbal', e'Fotbal, kluby, fotbalisti, trenéři, rozhodčí, zápasy, stadion

NFL, FIFA', 20, false, '2025-09-30 15:45:10.688000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (9, 'Fotbal v Česku', 'Český fotbal, české fotbalové kluby. Sparta, Slavie, Bohemians.', 36, false, '2025-09-30 15:43:56.115000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (65, 'Tenis', 'Tenis, tenista, Wimbledon, grandslam, US Open', 20, false, '2025-09-30 15:45:35.672000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (12, 'Filmy', 'Filmy, kino, filmoví herci, Hollywood, filmové novinky, filmové festivaly', 11, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (13, 'Sci-fi filmy', 'Sci-fi filmy. Filmy o vědě, robotech, budoucnosti', 12, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (15, 'Star Wars', 'Star Wars filmy George Lucas', 13, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (14, 'Star Trek', 'Star Trek - legendární sci-fi seriál a filmy od Gene Roddenberry. Captain Kirk, Picard, Janeway', 13, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (16, 'Aliens', e'Aliens, Vetřelci filmy od Ridley Scott a James Cameron,

Ellen Ripley - Sigourney Weaver', 13, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (59, 'Literatura', 'Literatura a knihy, spisovatelé, autoři', 11, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (33, 'Hudba', e'Hudba a hudebníci, skladatelé, textaři, kapely, zpěváci, festivaly, desky, vinyly, alba, singly, 

reggae, ska, rock, pop, metal, balet, opera, vážná hudba', 11, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (5, 'Počítačové hry', e'Počítačové hry, videohry, games players, hráči a vývojáři, PC gaming, console, Playstation, PS5, XBox, FPS, RPG, action 3rd person, game development, gameplay videa, streamování přes Twitch, herní světy, herní mechaniky, herní mapy, avatar, framerate.

Bethesda, Bioware, ID soft, Electronic Arts, Warhorse Studios, IO Interactive, Bohemia Interactive, Valve.

Steam, Gamescom.', 11, false, '2025-09-29 19:55:36.627000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (10, 'Volby 2025', 'Volby do poslanecké sněmovny České republiky 2025, předvolební kampaň, politici, debaty.', 6, false, '2025-09-30 15:24:49.097000 +00:00');
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (48, 'Metal Gear Solid', 'Videoherní série Metal Gear Solid. Solid Snake, Hideo Kojima', 5, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (52, 'FPS', 'FPS - first person shooters', 5, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (51, 'Overhype Studios', 'Overhype Studios', 5, true, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (43, 'Marvel Rivals', 'Marvel Rivals, Daredevil a Angela, Doctor Doom, Heart of Heaven', 5, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (7, 'Baldur''s Gate 3', 'Baldur''s Gate 3', 5, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (50, 'Tahové strategie', 'Počítačové hry tahové strategie, Turn-based strategy videogames ', 5, true, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (53, 'Helldivers 2', 'Helldivers 2', 5, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (46, 'Speedrunning', 'Speedrunning, hraní počítačových her na rychlost.', 5, false, null);
INSERT INTO realm (id, name, summary, parent_id, is_hidden, publish_date) OVERRIDING SYSTEM VALUE VALUES (47, 'Platformers', 'Počítačové hry typu Platformers - skákačky.', 5, false, null);

SELECT setval(
    pg_get_serial_sequence('realm', 'id'),
    (SELECT MAX(id) FROM realm)
);
