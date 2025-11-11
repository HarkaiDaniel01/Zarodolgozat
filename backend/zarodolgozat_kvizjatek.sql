-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 11. 09:56
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `zarodolgozat_kvizjatek`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jatekos`
--

CREATE TABLE `jatekos` (
  `jatekos_id` int(11) NOT NULL,
  `jatekos_nev` varchar(50) NOT NULL,
  `jatekos_jelszo` varchar(50) NOT NULL,
  `jatekos_pontszam` int(11) NOT NULL,
  `jatekos_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoria`
--

CREATE TABLE `kategoria` (
  `kategoria_id` int(11) NOT NULL,
  `kategoria_nev` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kategoria`
--

INSERT INTO `kategoria` (`kategoria_id`, `kategoria_nev`) VALUES
(1, 'Történelem'),
(2, 'Földrajz'),
(3, 'Irodalom'),
(4, 'Zene'),
(5, 'Sport');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kerdesek`
--

CREATE TABLE `kerdesek` (
  `kerdesek_id` int(11) NOT NULL,
  `kerdesek_kerdes` varchar(255) NOT NULL,
  `kerdesek_helyesValasz` varchar(255) NOT NULL,
  `kerdesek_helytelenValasz1` varchar(255) NOT NULL,
  `kerdesek_helytelenValasz2` varchar(255) NOT NULL,
  `kerdesek_helytelenValasz3` varchar(255) NOT NULL,
  `kerdesek_kategoria` int(11) NOT NULL,
  `kerdesek_leiras` varchar(255) NOT NULL,
  `kerdesek_nehezseg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kerdesek`
--

INSERT INTO `kerdesek` (`kerdesek_id`, `kerdesek_kerdes`, `kerdesek_helyesValasz`, `kerdesek_helytelenValasz1`, `kerdesek_helytelenValasz2`, `kerdesek_helytelenValasz3`, `kerdesek_kategoria`, `kerdesek_leiras`, `kerdesek_nehezseg`) VALUES
(1, 'Mikor volt a mohácsi csata?', '1526', '1241', '1848', '1703', 1, 'A magyar történelem egyik fontos csatája', 1),
(2, 'Ki volt az első magyar király?', 'Szent István', 'Szent László', 'IV. Béla', 'Hunyadi Mátyás', 1, 'Az államalapító uralkodó', 1),
(3, 'Hol található a Mount Everest?', 'Nepál és Kína határán', 'India', 'Pakisztán', 'Bhután', 2, 'A világ legmagasabb hegye', 1),
(4, 'Mi Magyarország fővárosa?', 'Budapest', 'Debrecen', 'Pécs', 'Szeged', 2, 'A Duna két partján fekvő város', 1),
(5, 'Ki írta a Toldi című művet?', 'Arany János', 'Petőfi Sándor', 'Jókai Mór', 'Vörösmarty Mihály', 3, 'Egy híres magyar eposz', 1),
(6, 'Melyik hangszernek van hat húrja?', 'Gitár', 'Hegedű', 'Fuvola', 'Dob', 4, 'Egy népszerű pengetős hangszer', 1),
(7, 'Melyik sportágban használják a labdát és a kosarat?', 'Kosárlabda', 'Röplabda', 'Foci', 'Kézilabda', 5, 'A játékosok kosárba dobják a labdát', 1),
(8, 'Melyik király uralkodott a reneszánsz idején Magyarországon?', 'Hunyadi Mátyás', 'IV. Béla', 'Szent László', 'Károly Róbert', 1, 'A reneszánsz kultúra elterjesztője', 2),
(9, 'Melyik földrész legnagyobb területű?', 'Ázsia', 'Afrika', 'Európa', 'Amerika', 2, 'A legnépesebb kontinens is', 1),
(10, 'Ki írta a Bánk bánt?', 'Katona József', 'Mikszáth Kálmán', 'Vörösmarty Mihály', 'Ady Endre', 3, 'Egy híres dráma a nemzeti színházban', 2),
(11, 'Melyik hangszer része a billentyű?', 'Zongora', 'Hegedű', 'Trombita', 'Dob', 4, 'Hangokat billentyűkkel szólaltat meg', 1),
(12, 'Melyik sportágban rendeznek Grand Slam tornákat?', 'Tenisz', 'Golf', 'Foci', 'Kézilabda', 5, 'Egyéni és páros mérkőzéseket játszanak', 2),
(13, 'Melyik évben lett vége a II. világháborúnak?', '1945', '1939', '1950', '1918', 1, 'Európa történelmének fordulópontja', 1),
(14, 'Melyik folyó szeli át Budapestet?', 'Duna', 'Tisza', 'Rába', 'Dráva', 2, 'Két partja Buda és Pest', 1),
(15, 'Ki írta a Nemzeti dalt?', 'Petőfi Sándor', 'Arany János', 'József Attila', 'Ady Endre', 3, 'A forradalom jelképe lett', 1),
(16, 'Ki volt Ludwig van Beethoven?', 'Zeneszerző', 'Festő', 'Író', 'Táncos', 4, 'Német klasszikus zeneszerző', 1),
(17, 'Melyik sportban használják a jégkorcsolyát?', 'Jégkorong', 'Síelés', 'Görkorcsolya', 'Snowboard', 5, 'Jégen játszott csapatsport', 1),
(18, 'Mikor tört ki az 1848-as forradalom Magyarországon?', '1848', '1956', '1526', '1703', 1, 'Szabadságharc kezdete', 1),
(19, 'Melyik ország fővárosa Párizs?', 'Franciaország', 'Olaszország', 'Spanyolország', 'Belgium', 2, 'A szerelem városa', 1),
(20, 'Ki írta az Egri csillagok című regényt?', 'Gárdonyi Géza', 'Jókai Mór', 'Arany János', 'Babits Mihály', 3, 'Egy híres történelmi regény', 1),
(21, 'Ki szerezte a „Tavaszi szonáta”-t?', 'Beethoven', 'Mozart', 'Liszt Ferenc', 'Haydn', 4, 'Egy híres hegedűszonáta', 2),
(22, 'Melyik sportágban rúgják a labdát a kapuba?', 'Labdarúgás', 'Kézilabda', 'Kosárlabda', 'Rögbi', 5, 'A világ legnépszerűbb sportja', 1),
(23, 'Mikor kezdődött az I. világháború?', '1914', '1918', '1939', '1945', 1, 'Nagy háborúnak is nevezik', 2),
(24, 'Melyik országban található a Nílus folyó?', 'Egyiptom', 'Etiópia', 'Kenya', 'Líbia', 2, 'Afrika leghosszabb folyója', 1),
(25, 'Ki írta a „Szeptember végén” című verset?', 'Petőfi Sándor', 'Arany János', 'József Attila', 'Babits Mihály', 3, 'Egy híres szerelmes vers', 1),
(26, 'Melyik hangszer fúvós?', 'Trombita', 'Gitár', 'Zongora', 'Dob', 4, 'Rézfúvós hangszer', 1),
(27, 'Melyik sportban van „ütő”?', 'Tenisz', 'Foci', 'Kosárlabda', 'Kézilabda', 5, 'A labdát ütővel játsszák', 1),
(28, 'Ki volt a honfoglalás vezére?', 'Árpád', 'Szent István', 'IV. Béla', 'Koppány', 1, 'A magyarok vezetője a honfoglaláskor', 1),
(29, 'Melyik ország fővárosa Róma?', 'Olaszország', 'Franciaország', 'Spanyolország', 'Görögország', 2, 'Az ókori birodalom központja', 1),
(30, 'Ki írta az „Ember tragédiáját”?', 'Madách Imre', 'Vörösmarty Mihály', 'József Attila', 'Kosztolányi Dezső', 3, 'Filozófiai dráma', 2),
(31, 'Ki volt Mozart?', 'Zeneszerző', 'Költő', 'Festő', 'Filozófus', 4, 'Zseniális osztrák zeneszerző', 1),
(32, 'Melyik sportágban rendeznek Olimpiát?', 'Több sportágban', 'Csak futásban', 'Csak úszásban', 'Csak tornában', 5, 'Négyévente megrendezett esemény', 1),
(33, 'Mikor zajlott a Rákóczi-szabadságharc?', '1703-1711', '1848-1849', '1526', '1956', 1, 'A Habsburgok ellen folyt', 2),
(34, 'Melyik hegység található Magyarországon?', 'Mátra', 'Alpok', 'Kaukázus', 'Pireneusok', 2, 'Benne van a Kékes-tető', 1),
(35, 'Ki írta a „Nyugat” folyóiratot alapító verseket?', 'Ady Endre', 'József Attila', 'Kosztolányi Dezső', 'Babits Mihály', 3, 'A modern magyar irodalom egyik alakja', 2),
(36, 'Ki komponálta a „Requiem”-et?', 'Mozart', 'Beethoven', 'Bach', 'Haydn', 4, 'Egy híres gyászmise', 2),
(37, 'Melyik sportban van touchdown?', 'Amerikai foci', 'Rögbi', 'Kosárlabda', 'Foci', 5, 'A pontszerzés módja', 2),
(38, 'Melyik évben lett Magyarország EU-tag?', '2004', '1999', '2010', '1990', 1, 'Az uniós csatlakozás éve', 1),
(39, 'Melyik tenger mossa Olaszország partjait?', 'Földközi-tenger', 'Adriai-tenger', 'Fekete-tenger', 'Balti-tenger', 2, 'Dél-Európában található', 1),
(40, 'Ki írta az „Esti Kornél”-t?', 'Kosztolányi Dezső', 'Babits Mihály', 'József Attila', 'Arany János', 3, 'Egy híres novellaciklus', 2),
(41, 'Melyik hangszer vonós?', 'Hegedű', 'Trombita', 'Fuvola', 'Dob', 4, 'Vonóval szólaltatják meg', 1),
(42, 'Melyik sportban van sarokrúgás?', 'Labdarúgás', 'Kosárlabda', 'Kézilabda', 'Rögbi', 5, 'A labdát rúgják sarokról', 1),
(43, 'Mikor történt a berlini fal leomlása?', '1989', '1970', '1991', '1961', 1, 'A hidegháború végét jelképezte', 2),
(44, 'Melyik országban található a Szahara?', 'Afrika több országában', 'Ausztrália', 'Európa', 'Amerika', 2, 'A világ legnagyobb sivataga', 2),
(45, 'Ki írta a „Tiszta szívvel” című verset?', 'József Attila', 'Ady Endre', 'Radnóti Miklós', 'Babits Mihály', 3, 'Egy fiatal költő bátor verse', 2),
(46, 'Ki volt Liszt Ferenc?', 'Zeneszerző', 'Költő', 'Festő', 'Történész', 4, 'Magyar zeneszerző és zongorista', 1),
(47, 'Melyik sportban játszanak ütővel és labdával, négy bázissal?', 'Baseball', 'Krikett', 'Tenisz', 'Golf', 5, 'Amerikai eredetű csapatsport', 2),
(48, 'Melyik évben tört ki a magyar forradalom a szovjet uralom ellen?', '1956', '1848', '1914', '1989', 1, 'Szabadságért folyt küzdelem', 2),
(49, 'Melyik ország fővárosa Tokió?', 'Japán', 'Kína', 'Korea', 'Vietnam', 2, 'Ázsia egyik legnagyobb városa', 1),
(50, 'Ki írta a „Hazám, hazám” című áriát?', 'Erkel Ferenc', 'Liszt Ferenc', 'Kodály Zoltán', 'Bartók Béla', 4, 'Az opera egyik híres része', 2),
(51, 'Mikor zajlott a tatárjárás Magyarországon?', '1241-1242', '1526', '1848-1849', '1703-1711', 1, 'A mongol invázió időszaka', 2),
(52, 'Ki volt a nándorfehérvári diadal hőse?', 'Hunyadi János', 'Zrínyi Miklós', 'Dobó István', 'Kinizsi Pál', 1, '1456-ban győzelmet aratott a törökök felett', 2),
(53, 'Melyik országban található a Kilimandzsáró?', 'Tanzánia', 'Kenya', 'Etiópia', 'Uganda', 2, 'Afrika legmagasabb hegye', 2),
(54, 'Mi a Föld leghosszabb hegysége?', 'Andok', 'Himalája', 'Alpok', 'Sziklás-hegység', 2, 'Dél-Amerikában húzódik végig', 3),
(55, 'Ki írta a „Légy jó mindhalálig” című regényt?', 'Móricz Zsigmond', 'Jókai Mór', 'Gárdonyi Géza', 'Kosztolányi Dezső', 3, 'Egy kisdiák története Debrecenben', 2),
(56, 'Ki volt Kodály Zoltán?', 'Zeneszerző', 'Költő', 'Festő', 'Filozófus', 4, 'Népdalgyűjtő és zenepedagógus', 1),
(57, 'Melyik sportágban van „les” szabály?', 'Labdarúgás', 'Kosárlabda', 'Rögbi', 'Vízilabda', 5, 'Támadójátékos helyzetére vonatkozó szabály', 2),
(58, 'Mikor volt a berlini fal felépítése?', '1961', '1956', '1945', '1989', 1, 'A hidegháború idején történt', 2),
(59, 'Melyik ország fővárosa Canberra?', 'Ausztrália', 'Új-Zéland', 'Dél-Afrika', 'Kanada', 2, 'Nem Sydney vagy Melbourne', 2),
(60, 'Ki írta a „Sorstalanság” című regényt?', 'Kertész Imre', 'József Attila', 'Ottlik Géza', 'Németh László', 3, 'Nobel-díjas magyar író műve', 3),
(61, 'Ki szerezte a „Háry János” zeneművet?', 'Kodály Zoltán', 'Liszt Ferenc', 'Bartók Béla', 'Erkel Ferenc', 4, 'Egy magyar népi hős története', 2),
(62, 'Melyik sportágban szerepel a „büntetődobás”?', 'Kosárlabda', 'Labdarúgás', 'Kézilabda', 'Jégkorong', 5, 'A szabálytalanság után dobják', 1),
(63, 'Melyik évben koronázták meg Szent Istvánt?', '1000', '997', '1038', '1100', 1, 'Az államalapítás szimbolikus éve', 2),
(64, 'Melyik országban található a Nagy-korallzátony?', 'Ausztrália', 'Indonézia', 'Fülöp-szigetek', 'Thaiföld', 2, 'A világ legnagyobb korallrendszere', 2),
(65, 'Ki írta a „Falu végén kurta kocsma” verset?', 'Petőfi Sándor', 'Ady Endre', 'József Attila', 'Kosztolányi Dezső', 3, 'Népies stílusú költemény', 1),
(66, 'Ki volt Bartók Béla?', 'Zeneszerző', 'Festő', 'Költő', 'Történész', 4, 'A 20. századi magyar zene úttörője', 2),
(67, 'Melyik sportágban rendezik a Tour de France-t?', 'Kerékpár', 'Futás', 'Autóverseny', 'Triatlon', 5, 'A világ leghíresebb országúti versenye', 2),
(68, 'Melyik évben volt a trianoni békeszerződés?', '1920', '1918', '1945', '1938', 1, 'Magyarország területe jelentősen csökkent', 3),
(69, 'Mi a világ legnagyobb sivataga?', 'Antarktisz', 'Szahara', 'Gobi', 'Kalahári', 2, 'Nem homokos, hanem jeges', 3),
(70, 'Ki írta az „Iskola a határon”-t?', 'Ottlik Géza', 'Kosztolányi Dezső', 'Móricz Zsigmond', 'Karinthy Frigyes', 3, 'Katonaiskola életét mutatja be', 3),
(71, 'Ki komponálta a „Magyar Rapszódiák”-at?', 'Liszt Ferenc', 'Erkel Ferenc', 'Kodály Zoltán', 'Bartók Béla', 4, 'Virtuóz zongoradarabok sorozata', 2),
(72, 'Melyik sportban használják a „snooker” kifejezést?', 'Biliárd', 'Tenisz', 'Golf', 'Krikett', 5, 'Zöld posztón játszott játék', 2),
(73, 'Melyik évben történt az amerikai függetlenségi nyilatkozat aláírása?', '1776', '1789', '1812', '1750', 1, 'Az Egyesült Államok születése', 3),
(74, 'Melyik ország fővárosa Ottawa?', 'Kanada', 'Egyesült Államok', 'Ausztrália', 'Norvégia', 2, 'Észak-Amerikában található', 2),
(75, 'Ki írta a „Nemzeti klasszikus” című költeményt?', 'Vörösmarty Mihály', 'Petőfi Sándor', 'Arany János', 'Ady Endre', 3, 'A hazaszeretet témáját dolgozza fel', 2),
(76, 'Ki volt Bach?', 'Zeneszerző', 'Festő', 'Filozófus', 'Költő', 4, 'Barokk korszak mestere', 2),
(77, 'Melyik sportban számít a „triplázás”?', 'Labdarúgás', 'Kosárlabda', 'Kézilabda', 'Tenisz', 5, 'Egy játékos három gólt szerez', 2),
(78, 'Mikor zajlott az 1956-os forradalom?', '1956', '1945', '1989', '1968', 1, 'A szovjet megszállás ellen tört ki', 2),
(79, 'Melyik országban található a Grand Canyon?', 'Egyesült Államok', 'Kanada', 'Mexikó', 'Chile', 2, 'Arizona államban van', 2),
(80, 'Ki írta a „Hull a pelyhes fehér hó” című verset?', 'Weöres Sándor', 'Petőfi Sándor', 'József Attila', 'Arany János', 3, 'Egy népszerű téli gyermekvers', 1),
(81, 'Ki komponálta a „Carmina Burana”-t?', 'Carl Orff', 'Beethoven', 'Brahms', 'Mozart', 4, 'Egy kórusmű a szerencse kerekéről', 3),
(82, 'Melyik sportban szerepel a „büntetőlap”?', 'Foci', 'Kosárlabda', 'Röplabda', 'Jégkorong', 5, 'Sárga vagy piros színű lehet', 1),
(83, 'Melyik évben fedezték fel Amerikát?', '1492', '1517', '1600', '1776', 1, 'Kolumbusz Kristóf hajózott oda', 1),
(84, 'Melyik országban található a Taj Mahal?', 'India', 'Pakisztán', 'Nepál', 'Banglades', 2, 'Szerelmi emlékmű', 1),
(85, 'Ki írta a „Pál utcai fiúk”-at?', 'Molnár Ferenc', 'Móricz Zsigmond', 'Jókai Mór', 'Kosztolányi Dezső', 3, 'Egy budapesti gyerekcsapat története', 1),
(86, 'Ki volt Giuseppe Verdi?', 'Zeneszerző', 'Festő', 'Író', 'Filozófus', 4, 'Olasz opera komponista', 2),
(87, 'Melyik sportágban van „játszma” és „szett”?', 'Tenisz', 'Kosárlabda', 'Foci', 'Röplabda', 5, 'Egyéni vagy páros mérkőzéseken', 1),
(88, 'Mikor volt a magyar honfoglalás?', '895', '1000', '1241', '1526', 1, 'A magyar törzsek letelepedése', 2),
(89, 'Melyik ország fővárosa Buenos Aires?', 'Argentína', 'Brazília', 'Chile', 'Peru', 2, 'Dél-Amerika egyik legnagyobb városa', 2),
(90, 'Ki írta az „Új versek” kötetet?', 'Ady Endre', 'Babits Mihály', 'Kosztolányi Dezső', 'József Attila', 3, 'A modern magyar líra kezdete', 3),
(91, 'Ki szerezte a „Für Elise”-t?', 'Beethoven', 'Mozart', 'Bach', 'Haydn', 4, 'Egy híres zongoradarab', 1),
(92, 'Melyik sportban használják a „büntetőpárbaj” kifejezést?', 'Labdarúgás', 'Kosárlabda', 'Kézilabda', 'Jégkorong', 5, 'Döntetlen után következhet', 2),
(93, 'Melyik évben omlott össze a Római Birodalom Nyugaton?', '476', '410', '800', '395', 1, 'A középkor kezdete', 3),
(94, 'Melyik ország fővárosa Stockholm?', 'Svédország', 'Finnország', 'Norvégia', 'Dánia', 2, 'Skandináv ország', 2),
(95, 'Ki írta a „Tündér Lala”-t?', 'Szabó Magda', 'Janikovszky Éva', 'Lázár Ervin', 'Móricz Zsigmond', 3, 'Gyermekeknek szóló mese', 1),
(96, 'Ki komponálta a „Diótörő” balettet?', 'Csajkovszkij', 'Beethoven', 'Mozart', 'Liszt Ferenc', 4, 'Egy karácsonyi klasszikus balett', 1),
(97, 'Melyik sportban használnak korongot?', 'Jégkorong', 'Kosárlabda', 'Kézilabda', 'Rögbi', 5, 'A jégen játszott gyors csapatsport', 1),
(98, 'Mikor volt a reformáció kezdete?', '1517', '1492', '1618', '1456', 1, 'Luther Márton fellépése', 3),
(99, 'Melyik ország fővárosa Athén?', 'Görögország', 'Törökország', 'Olaszország', 'Albánia', 2, 'Az ókori demokrácia bölcsője', 1),
(100, 'Ki írta a „Himnuszt”?', 'Kölcsey Ferenc', 'Vörösmarty Mihály', 'Arany János', 'Petőfi Sándor', 3, 'A magyar nemzeti himnusz szövegírója', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `nehezseg`
--

CREATE TABLE `nehezseg` (
  `nehezseg_id` int(11) NOT NULL,
  `nehezseg_szint` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `nehezseg`
--

INSERT INTO `nehezseg` (`nehezseg_id`, `nehezseg_szint`) VALUES
(1, 'Könnyű'),
(2, 'Közepes'),
(3, 'Nehéz');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `jatekos`
--
ALTER TABLE `jatekos`
  ADD PRIMARY KEY (`jatekos_id`);

--
-- A tábla indexei `kategoria`
--
ALTER TABLE `kategoria`
  ADD PRIMARY KEY (`kategoria_id`);

--
-- A tábla indexei `kerdesek`
--
ALTER TABLE `kerdesek`
  ADD PRIMARY KEY (`kerdesek_id`),
  ADD KEY `kerdesek_kategoria` (`kerdesek_kategoria`),
  ADD KEY `kerdesek_nehezseg` (`kerdesek_nehezseg`);

--
-- A tábla indexei `nehezseg`
--
ALTER TABLE `nehezseg`
  ADD PRIMARY KEY (`nehezseg_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `jatekos`
--
ALTER TABLE `jatekos`
  MODIFY `jatekos_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `kategoria`
--
ALTER TABLE `kategoria`
  MODIFY `kategoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  MODIFY `kerdesek_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT a táblához `nehezseg`
--
ALTER TABLE `nehezseg`
  MODIFY `nehezseg_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  ADD CONSTRAINT `kerdesek_ibfk_1` FOREIGN KEY (`kerdesek_kategoria`) REFERENCES `kategoria` (`kategoria_id`),
  ADD CONSTRAINT `kerdesek_ibfk_2` FOREIGN KEY (`kerdesek_nehezseg`) REFERENCES `nehezseg` (`nehezseg_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
