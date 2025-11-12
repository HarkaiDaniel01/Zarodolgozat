-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 12. 10:34
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
CREATE DATABASE IF NOT EXISTS `zarodolgozat_kvizjatek` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `zarodolgozat_kvizjatek`;

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
(100, 'Ki írta a „Himnuszt”?', 'Kölcsey Ferenc', 'Vörösmarty Mihály', 'Arany János', 'Petőfi Sándor', 3, 'A magyar nemzeti himnusz szövegírója', 1),
(101, 'Mikor kezdődött a középkor?', '476', '0', '1492', '1000', 1, 'A Nyugatrómai Birodalom bukása után', 3),
(102, 'Ki volt Zrínyi Miklós?', 'Katonai vezető és költő', 'Király', 'Zenész', 'Festő', 1, 'Szigetvár hőse és írója', 3),
(103, 'Melyik kontinensen található a Nílus forrása?', 'Afrika', 'Ázsia', 'Európa', 'Amerika', 2, 'A Föld leghosszabb folyója itt ered', 1),
(104, 'Mi a világ legnagyobb óceánja?', 'Csendes-óceán', 'Atlanti-óceán', 'Indiai-óceán', 'Jeges-tenger', 2, 'A Föld felületének harmadát fedi', 2),
(105, 'Ki írta a „Szindbád” novellákat?', 'Krúdy Gyula', 'Kosztolányi Dezső', 'Babits Mihály', 'Ady Endre', 3, 'Egy álmodozó újságíró története', 2),
(106, 'Ki szerezte a „Kossuth-nótát”?', 'Erkel Ferenc', 'Kodály Zoltán', 'Liszt Ferenc', 'Bartók Béla', 4, 'Egy hazafias dallam a 19. századból', 2),
(107, 'Melyik sportban található a „birkózószőnyeg”?', 'Birkózás', 'Judo', 'Karate', 'Szumó', 5, 'Egy küzdősport eszköze', 1),
(108, 'Mikor volt a reformkor Magyarországon?', '1825–1848', '1703–1711', '1867–1914', '1920–1945', 1, 'A polgári átalakulás időszaka', 2),
(109, 'Melyik ország fővárosa Lisszabon?', 'Portugália', 'Spanyolország', 'Olaszország', 'Franciaország', 2, 'Az Ibériai-félszigeten található', 1),
(110, 'Ki írta a „Tragédia” folytatását „Az ember komédiája” címmel?', 'Karinthy Frigyes', 'Madách Imre', 'Kosztolányi Dezső', 'Babits Mihály', 3, 'Szatirikus paródia', 2),
(111, 'Ki volt Chopin?', 'Zeneszerző', 'Festő', 'Költő', 'Filozófus', 4, 'Lengyel romantikus zeneszerző', 2),
(112, 'Melyik sportágban van „hárompontos dobás”?', 'Kosárlabda', 'Röplabda', 'Foci', 'Kézilabda', 5, 'Távoli dobás a gyűrűbe', 1),
(113, 'Mikor volt a kiegyezés Ausztria és Magyarország között?', '1867', '1848', '1918', '1920', 1, 'Létrejött az Osztrák–Magyar Monarchia', 2),
(114, 'Melyik országban található a Himalája legmagasabb pontja?', 'Nepál', 'India', 'Bhután', 'Kína', 2, 'A Mount Everest is itt emelkedik', 2),
(115, 'Ki írta a „Nincsen apám, se anyám” verseskötetet?', 'József Attila', 'Ady Endre', 'Radnóti Miklós', 'Kosztolányi Dezső', 3, 'Egy korai lírai gyűjtemény', 2),
(116, 'Ki volt Brahms?', 'Zeneszerző', 'Író', 'Festő', 'Filozófus', 4, 'Német romantikus zeneszerző', 2),
(117, 'Melyik sportban mérik a sebességet km/h-ban?', 'Atlétika', 'Úszás', 'Autóverseny', 'Sakk', 5, 'Forma–1-ben fontos adat', 1),
(118, 'Mikor történt a Bastille ostroma?', '1789', '1776', '1815', '1848', 1, 'A francia forradalom kezdete', 3),
(119, 'Melyik ország fővárosa Oslo?', 'Norvégia', 'Svédország', 'Finnország', 'Dánia', 2, 'Skandináv ország központja', 1),
(120, 'Ki írta a „Halotti beszéd és könyörgés”-t?', 'Ismeretlen', 'Kölcsey Ferenc', 'Vörösmarty Mihály', 'Pázmány Péter', 3, 'A legrégebbi magyar nyelvemlék', 3),
(121, 'Ki volt Vivaldi?', 'Zeneszerző', 'Festő', 'Költő', 'Történész', 4, 'A „Négy évszak” komponistája', 1),
(122, 'Melyik sportban használják a „match point” kifejezést?', 'Tenisz', 'Kosárlabda', 'Foci', 'Röplabda', 5, 'A mérkőzés utolsó pontja lehet', 1),
(123, 'Melyik évben ért véget az I. világháború?', '1918', '1914', '1920', '1939', 1, 'A versailles-i béke éve', 2),
(124, 'Melyik országban található a Kalahári-sivatag?', 'Botswana', 'Egyiptom', 'Nigéria', 'Etiópia', 2, 'Afrika déli részén terül el', 2),
(125, 'Ki írta az „Édes Anná”-t?', 'Kosztolányi Dezső', 'Móricz Zsigmond', 'Krúdy Gyula', 'Babits Mihály', 3, 'Társadalomkritikus regény', 2),
(126, 'Ki volt Puccini?', 'Zeneszerző', 'Festő', 'Filozófus', 'Író', 4, 'Az „Aida” és „Tosca” szerzője', 2),
(127, 'Melyik sportban számít a „hole-in-one”?', 'Golf', 'Tenisz', 'Baseball', 'Krikett', 5, 'Egy ütésből a lyukba kerül a labda', 2),
(128, 'Mikor kezdődött az ipari forradalom?', '18. század', '15. század', '19. század', '16. század', 1, 'A gépesítés kora', 3),
(129, 'Melyik ország fővárosa Bern?', 'Svájc', 'Ausztria', 'Németország', 'Belgium', 2, 'Nem Zürich', 1),
(130, 'Ki írta a „Tóték”-at?', 'Örkény István', 'Kosztolányi Dezső', 'Móricz Zsigmond', 'Krúdy Gyula', 3, 'Abszurd dráma a háborúról', 2),
(131, 'Ki volt Händel?', 'Zeneszerző', 'Költő', 'Festő', 'Történész', 4, 'A „Messiás” oratórium alkotója', 2),
(132, 'Melyik sportban mérik a teljesítményt „ütés”-ben?', 'Golf', 'Tenisz', 'Foci', 'Baseball', 5, 'A cél minél kevesebb ütés', 2),
(133, 'Mikor lett Magyarország köztársaság?', '1946', '1918', '1956', '1990', 1, 'A királyság megszűnt', 2),
(134, 'Melyik országban található a Szent Péter-bazilika?', 'Vatikán', 'Olaszország', 'Franciaország', 'Spanyolország', 2, 'A katolikus egyház központja', 1),
(135, 'Ki írta a „Radnóti Miklós naplóját”?', 'Radnóti Miklós', 'Kosztolányi Dezső', 'József Attila', 'Babits Mihály', 3, 'A háborús időszak dokumentuma', 2),
(136, 'Ki volt Haydn?', 'Zeneszerző', 'Festő', 'Költő', 'Író', 4, 'A szimfónia atyja', 2),
(137, 'Melyik sportban használnak „set point”-ot?', 'Tenisz', 'Foci', 'Kosárlabda', 'Röplabda', 5, 'Játszma eldöntő pontja', 2),
(138, 'Mikor volt a második világháború kezdete?', '1939', '1918', '1941', '1945', 1, 'Lengyelország megtámadásával indult', 2),
(139, 'Melyik ország fővárosa Varsó?', 'Lengyelország', 'Csehország', 'Szlovákia', 'Ukrajna', 2, 'Közép-Európai ország', 1),
(140, 'Ki írta a „Kincskereső kisködmön”-t?', 'Móra Ferenc', 'Jókai Mór', 'Gárdonyi Géza', 'Móricz Zsigmond', 3, 'Egy gyerek története alföldi faluban', 2),
(141, 'Ki volt Paganini?', 'Hegedűművész', 'Festő', 'Zongorista', 'Költő', 4, 'Virtuóz olasz zenész', 2),
(142, 'Melyik sportban rendeznek világbajnokságot „MMA” néven?', 'Küzdősport', 'Labdarúgás', 'Kosárlabda', 'Vízilabda', 5, 'Vegyes harcművészet', 2),
(143, 'Mikor lett Magyarország NATO-tag?', '1999', '2004', '1990', '1989', 1, 'A védelmi szövetséghez csatlakozott', 2),
(144, 'Melyik országban található a Szentföld?', 'Izrael', 'Egyiptom', 'Jordánia', 'Irán', 2, 'A Biblia eseményeinek helyszíne', 1),
(145, 'Ki írta a „Galagonya” című verset?', 'Weöres Sándor', 'Petőfi Sándor', 'József Attila', 'Ady Endre', 3, 'Egy népszerű gyermekvers', 1),
(146, 'Ki komponálta a „Bolero”-t?', 'Maurice Ravel', 'Claude Debussy', 'Beethoven', 'Mozart', 4, 'Egy francia zenemű ritmusos témával', 2),
(147, 'Melyik sportban szerepel a „hátrahajlás”?', 'Torna', 'Úszás', 'Atlétika', 'Súlyemelés', 5, 'Gimnasztikai elem', 1),
(148, 'Mikor egyesült Buda, Pest és Óbuda?', '1873', '1867', '1900', '1848', 1, 'Budapest megalakulása', 2),
(149, 'Melyik ország fővárosa Kairó?', 'Egyiptom', 'Tunézia', 'Líbia', 'Szudán', 2, 'Afrika egyik legnagyobb városa', 1),
(150, 'Ki írta a „Széchenyi élete” című művet?', 'Jókai Mór', 'Mikszáth Kálmán', 'Gárdonyi Géza', 'Kosztolányi Dezső', 3, 'Egy híres történelmi életrajz', 2),
(151, 'Mikor volt a nándorfehérvári diadal?', '1456', '1526', '1241', '1541', 1, 'Hunyadi János és Kapisztrán János győzelme', 3),
(152, 'Ki vezette a reformációt Németországban?', 'Martin Luther', 'Jean Calvin', 'John Knox', 'Erasmus', 1, 'A wittenbergi egyetemen kezdte meg tanait', 2),
(153, 'Melyik uralkodó idején volt a Pragmatica Sanctio kiadása?', 'III. Károly', 'Mária Terézia', 'II. József', 'I. Ferenc', 1, 'A nőági öröklésről szóló rendelet', 2),
(154, 'Mi volt az 1848–49-es szabadságharc utolsó csatája?', 'Világosi fegyverletétel', 'Isaszeg', 'Arad', 'Buda visszavétele', 1, 'Ezzel ért véget a szabadságharc', 3),
(155, 'Mikor lett Magyarország köztársaság?', '1946', '1918', '1989', '1949', 1, 'A királyság megszűnése után', 2),
(156, 'Melyik város volt Bizánc új neve Konstantin idején?', 'Konstantinápoly', 'Jeruzsálem', 'Athén', 'Róma', 1, 'A Római Birodalom keleti fővárosa', 2),
(157, 'Melyik országban található a Titicaca-tó?', 'Peru és Bolívia', 'Argentína', 'Chile', 'Ecuador', 2, 'A világ legmagasabban fekvő hajózható tava', 3),
(158, 'Mi a világ legmélyebb tava?', 'Bajkál-tó', 'Tanganyika-tó', 'Michigan-tó', 'Balaton', 2, 'Szibériában található', 3),
(159, 'Melyik hegységben található a Mont Blanc?', 'Alpok', 'Pireneusok', 'Appenninek', 'Kárpátok', 2, 'Nyugat-Európa legmagasabb pontja', 2),
(160, 'Melyik ország fővárosa Reykjavík?', 'Izland', 'Norvégia', 'Finnország', 'Svédország', 2, 'Európa legészakibb fővárosa', 2),
(161, 'Melyik folyó szeli át Londont?', 'Temze', 'Rajna', 'Seine', 'Duna', 2, 'A brit főváros központi folyója', 1),
(162, 'Melyik földrész legkisebb területű?', 'Ausztrália', 'Európa', 'Dél-Amerika', 'Antarktisz', 2, 'Egyben ország is', 1),
(163, 'Ki írta a „Füstbe ment terv” című verset?', 'Petőfi Sándor', 'Arany János', 'Ady Endre', 'József Attila', 3, 'Egy lírai vers édesanyjához', 2),
(164, 'Ki volt a Nyugat folyóirat első főszerkesztője?', 'Ignotus', 'Ady Endre', 'Kosztolányi Dezső', 'Babits Mihály', 3, 'A modern irodalom lapjának alapítója', 3),
(165, 'Ki írta a „Szondi két apródja” című balladát?', 'Arany János', 'Petőfi Sándor', 'Tompa Mihály', 'Jókai Mór', 3, 'Egy hősi történetet dolgoz fel', 2),
(166, 'Melyik költő írta a „Rekviem egy gyilkosért” című verset?', 'Radnóti Miklós', 'József Attila', 'Ady Endre', 'Kosztolányi Dezső', 3, 'A II. világháború borzalmait idézi', 3),
(167, 'Melyik regény főhőse Scarlett O’Hara?', 'Elfújta a szél', 'Büszkeség és balítélet', 'Jane Eyre', 'Anna Karenina', 3, 'Egy amerikai polgárháborús történet', 2),
(168, 'Ki írta a „Háború és béke” című regényt?', 'Tolsztoj', 'Dosztojevszkij', 'Gorkij', 'Puskin', 3, 'Egy orosz klasszikus mű', 3),
(169, 'Melyik zeneszerző írta a „Bolero”-t?', 'Maurice Ravel', 'Claude Debussy', 'Camille Saint-Saëns', 'Bizet', 4, 'Egyetlen tételes mű', 2),
(170, 'Ki komponálta a „Carmina Burana”-t?', 'Carl Orff', 'Richard Strauss', 'Mahler', 'Brahms', 4, 'Középkori szövegekre írt zenemű', 3),
(171, 'Melyik zeneszerző volt süket élete vége felé?', 'Beethoven', 'Bach', 'Mozart', 'Haydn', 4, 'Ennek ellenére komponált szimfóniákat', 1),
(172, 'Ki volt a „Kékszakállú herceg vára” zeneszerzője?', 'Bartók Béla', 'Kodály Zoltán', 'Erkel Ferenc', 'Liszt Ferenc', 4, 'Magyar opera szimbolista stílusban', 3),
(173, 'Ki írta a „Psalmus Hungaricus”-t?', 'Kodály Zoltán', 'Bartók Béla', 'Erkel Ferenc', 'Liszt Ferenc', 4, 'Egy kórusmű latin és magyar szöveggel', 3),
(174, 'Ki írta a „Mese a kis cédrusról” című dalt?', 'Zorán', 'Presser Gábor', 'Demjén Ferenc', 'Koncz Zsuzsa', 4, 'Egy lírai magyar könnyűzenei mű', 2),
(175, 'Melyik hangszer a legmélyebb vonós a zenekarban?', 'Nagybőgő', 'Cselló', 'Brácsa', 'Hegedű', 4, 'A vonós szekció alapja', 2),
(176, 'Melyik sportágban használnak malomformájú táblát?', 'Darts', 'Golyózás', 'Bowling', 'Snooker', 5, 'Céltáblás játék', 1),
(177, 'Ki nyerte a legtöbb aranyérmet az olimpiai játékok történetében?', 'Michael Phelps', 'Usain Bolt', 'Larisa Latyinina', 'Carl Lewis', 5, 'Amerikai úszólegenda', 3),
(178, 'Melyik sportágban található a „slam dunk”?', 'Kosárlabda', 'Röplabda', 'Tenisz', 'Kézilabda', 5, 'Látványos pontszerzés', 1),
(179, 'Melyik országban rendeztek először modern olimpiát?', 'Görögország', 'Franciaország', 'Anglia', 'USA', 5, '1896-ban tartották', 2),
(180, 'Mikor rendeztek először labdarúgó világbajnokságot?', '1930', '1950', '1920', '1938', 5, 'Uruguay rendezte', 2),
(181, 'Ki volt Puskás Ferenc klubcsapata Spanyolországban?', 'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Valencia', 5, 'Sok gólt szerzett ott', 2),
(182, 'Melyik sportágban használják a „triple axel” kifejezést?', 'Műkorcsolya', 'Torna', 'Szinkronúszás', 'Snowboard', 5, 'Háromfordulatos ugrás', 3),
(183, 'Melyik sportban szerepel a „Grand Prix”?', 'Forma–1', 'MotoGP', 'Rali', 'Bicikli', 5, 'Autóverseny-sorozat', 2),
(184, 'Ki volt az első női olimpiai bajnok?', 'Hélène de Pourtalès', 'Charlotte Cooper', 'Nadia Comăneci', 'Wilma Rudolph', 5, '1900-as párizsi olimpián nyert', 3),
(185, 'Melyik ország nyerte a 2014-es labdarúgó-világbajnokságot?', 'Németország', 'Brazília', 'Argentína', 'Franciaország', 5, 'A döntőt 1–0-ra nyerték', 2),
(186, 'Melyik hegység húzódik Nepál és Tibet között?', 'Himalája', 'Andok', 'Kaukázus', 'Kordillerák', 2, 'A világ legmagasabb hegyeit tartalmazza', 2),
(187, 'Melyik országban található az Atacama-sivatag?', 'Chile', 'Peru', 'Argentína', 'Mexikó', 2, 'A Föld legszárazabb területe', 3),
(188, 'Melyik városban található a Taj Mahal?', 'Agra', 'Delhi', 'Mumbai', 'Jaipur', 2, 'Egy híres mauzóleum Indiában', 2),
(189, 'Melyik évben történt az 1956-os melbourne-i olimpia magyar vízilabda „vérfürdője”?', '1956', '1960', '1948', '1964', 5, 'A Szovjetunió ellen játszották', 2),
(190, 'Melyik sportban van „en passant” szabály?', 'Sakk', 'Tenisz', 'Baseball', 'Gó', 5, 'Speciális gyaloglépés', 3),
(191, 'Melyik zeneszerző írta a „Májusfa” című kórusművet?', 'Kodály Zoltán', 'Liszt Ferenc', 'Bartók Béla', 'Erkel Ferenc', 4, 'Magyar népzenei feldolgozás', 2),
(192, 'Ki írta a „Trisztán és Izolda” című operát?', 'Richard Wagner', 'Verdi', 'Puccini', 'Rossini', 4, 'Egy romantikus német opera', 3),
(193, 'Melyik ország fővárosa Bogota?', 'Kolumbia', 'Peru', 'Venezuela', 'Ecuador', 2, 'Dél-Amerika egyik legnagyobb városa', 2),
(194, 'Ki volt az utolsó magyar király?', 'IV. Károly', 'Ferenc József', 'II. András', 'I. Lajos', 1, '1916–1918 között uralkodott', 2),
(195, 'Mikor egyesült Buda, Pest és Óbuda?', '1873', '1867', '1896', '1900', 1, 'Ekkor jött létre Budapest', 2),
(196, 'Melyik költő írta a „Hajnali részegség” című verset?', 'Kosztolányi Dezső', 'József Attila', 'Ady Endre', 'Babits Mihály', 3, 'Filozófiai hangvételű költemény', 3),
(197, 'Melyik országban született Chopin?', 'Lengyelország', 'Franciaország', 'Németország', 'Olaszország', 4, 'Romantikus zeneszerző', 2),
(198, 'Melyik földrajzi szélességen fekszik az Egyenlítő?', '0°', '45°', '23,5°', '90°', 2, 'A Föld középső vonala', 2),
(199, 'Melyik sportágban szerepel a „snatch” és „clean and jerk”?', 'Súlyemelés', 'Testépítés', 'Küzdősport', 'Atlétika', 5, 'Két fogásnem neve', 3),
(200, 'Ki írta a „Szózat” zenéjét?', 'Egressy Béni', 'Erkel Ferenc', 'Kodály Zoltán', 'Liszt Ferenc', 4, 'A nemzeti dal zeneszerzője', 2),
(201, 'Mikor volt a tatárjárás Magyarországon?', '1241–1242', '1526', '1301', '1703', 1, 'IV. Béla uralkodása alatt történt', 2),
(202, 'Ki volt a Habsburg-ház első magyar királya?', 'I. Ferdinánd', 'II. József', 'I. Lipót', 'III. Károly', 1, 'A mohácsi vész után lépett trónra', 3),
(203, 'Mikor volt a berlini kongresszus?', '1878', '1919', '1848', '1815', 1, 'A balkáni határokról döntött', 3),
(204, 'Melyik évben tört ki a francia forradalom?', '1789', '1812', '1914', '1648', 1, 'A Bastille ostroma ekkor történt', 1),
(205, 'Ki volt Magyarország első női uralkodója?', 'Mária Terézia', 'Sisi', 'Zrínyi Ilona', 'Erzsébet királyné', 1, 'A 18. században uralkodott', 2),
(206, 'Melyik ország fővárosa Oslo?', 'Norvégia', 'Svédország', 'Finnország', 'Dánia', 2, 'Skandináv ország', 1),
(207, 'Melyik hegység található Olaszország és Svájc között?', 'Alpok', 'Pireneusok', 'Appenninek', 'Kárpátok', 2, 'Európa legmagasabb hegylánca', 1),
(208, 'Melyik kontinensen található Kenya?', 'Afrika', 'Ázsia', 'Európa', 'Dél-Amerika', 2, 'Kelet-afrikai ország', 1),
(209, 'Mi a legnagyobb sziget a Földön?', 'Grönland', 'Madagaszkár', 'Borneó', 'Új-Guinea', 2, 'Jeges-tengeri sziget', 2),
(210, 'Mi a Viktória-tó folyója?', 'Nílus', 'Zambezi', 'Kongó', 'Niger', 2, 'Afrika legnagyobb tava', 3),
(211, 'Ki írta a „Csendes éj” című karácsonyi dalt?', 'Franz Xaver Gruber', 'Mozart', 'Bach', 'Schubert', 4, 'Klasszikus karácsonyi ének', 1),
(212, 'Ki komponálta a „Nabucco” operát?', 'Giuseppe Verdi', 'Puccini', 'Rossini', 'Donizetti', 4, 'Az olasz opera mestere', 2),
(213, 'Melyik hangszerhez tartozik a „fuvola”?', 'Fúvós', 'Vonós', 'Billentyűs', 'Ütős', 4, 'Fúvós hangszer család', 1),
(214, 'Ki írta a „Moldva” szimfonikus költeményt?', 'Smetana', 'Dvořák', 'Liszt Ferenc', 'Haydn', 4, 'Cseh nemzeti zeneszerző műve', 3),
(215, 'Ki volt Erkel Ferenc leghíresebb operájának címszereplője?', 'Hunyadi László', 'Bánk bán', 'István király', 'Zrínyi', 4, 'A magyar romantika zeneszerzője', 3),
(216, 'Melyik sportban van „büntetődobás”?', 'Kosárlabda', 'Kézilabda', 'Foci', 'Röplabda', 5, 'A játékos a vonalról dob pontot', 1),
(217, 'Ki volt az első magyar Forma–1-es versenyző?', 'Baumgartner Zsolt', 'Michelisz Norbert', 'Kiss Norbert', 'Tóth László', 5, '2003-ban debütált', 2),
(218, 'Melyik sportban használják a „birdie” kifejezést?', 'Golf', 'Tenisz', 'Krikett', 'Snooker', 5, 'Egy ütéssel a par alatti eredmény', 3),
(219, 'Melyik országban született Pelé?', 'Brazília', 'Argentína', 'Uruguay', 'Chile', 5, 'Focilegenda', 1),
(220, 'Melyik sportban létezik „röplabda”?', 'Röplabda', 'Kosárlabda', 'Tenisz', 'Kézilabda', 5, 'Labdajáték hálóval', 1),
(221, 'Ki írta a „Szent Péter esernyője” című regényt?', 'Mikszáth Kálmán', 'Jókai Mór', 'Krúdy Gyula', 'Gárdonyi Géza', 3, 'Humoros történet Glogova falujában', 2),
(222, 'Ki volt a „Fanni hagyományai” szerzője?', 'Kármán József', 'Kazinczy Ferenc', 'Csokonai', 'Berzsenyi Dániel', 3, 'A magyar felvilágosodás regénye', 3),
(223, 'Ki írta a „Pál utcai fiúk” című regényt?', 'Molnár Ferenc', 'Jókai Mór', 'Mikszáth Kálmán', 'Gárdonyi Géza', 3, 'Klasszikus ifjúsági regény', 1),
(224, 'Melyik költő írta a „Levél egy színészhez” című verset?', 'Radnóti Miklós', 'József Attila', 'Ady Endre', 'Babits Mihály', 3, 'A háború borzalmait idézi', 3),
(225, 'Melyik ország fővárosa Buenos Aires?', 'Argentína', 'Chile', 'Uruguay', 'Peru', 2, 'Dél-amerikai metropolisz', 1),
(226, 'Melyik ország zászlaja piros-fehér-piros?', 'Ausztria', 'Lengyelország', 'Peru', 'Dánia', 2, 'Európai ország jelképe', 1),
(227, 'Melyik földrész legnépesebb?', 'Ázsia', 'Európa', 'Afrika', 'Amerika', 2, 'Több mint 4 milliárd lakossal', 1),
(228, 'Melyik országban van a Kilimandzsáró?', 'Tanzánia', 'Kenya', 'Etiópia', 'Uganda', 2, 'Afrika legmagasabb hegye', 2),
(229, 'Melyik városban épült a Colosseum?', 'Róma', 'Athén', 'Párizs', 'Madrid', 1, 'Az ókori gladiátorok arénája', 1),
(230, 'Mikor koronázták meg Szent Istvánt?', '1000 karácsonyán', '997-ben', '1015-ben', '1038-ban', 1, 'A keresztény királyság alapítása', 2),
(231, 'Mikor zajlott a reformkor Magyarországon?', '1825–1848', '1703–1711', '1867–1896', '1914–1918', 1, 'A modernizáció korszaka', 3),
(232, 'Ki volt az 1848-as márciusi ifjak vezetője?', 'Petőfi Sándor', 'Arany János', 'Jókai Mór', 'Vörösmarty Mihály', 1, 'A Pilvax kör központi alakja', 2),
(233, 'Mikor volt az első világháború?', '1914–1918', '1939–1945', '1848–1849', '1703–1711', 1, 'Nagy háborúnak is nevezik', 1),
(234, 'Ki írta a „Faust” című művet?', 'Goethe', 'Schiller', 'Heine', 'Nietzsche', 3, 'Egy német klasszikus mű', 2),
(235, 'Ki írta a „Candide”-ot?', 'Voltaire', 'Rousseau', 'Descartes', 'Molière', 3, 'Francia felvilágosodás szatirikus regénye', 3),
(236, 'Melyik zeneszerző írta a „Tűzmadár”-t?', 'Stravinsky', 'Prokofjev', 'Csajkovszkij', 'Rimszkij-Korszakov', 4, 'Balettzene', 3),
(237, 'Ki volt az „Ave Maria” szerzője?', 'Schubert', 'Bach', 'Mozart', 'Beethoven', 4, 'Romantikus dalmű', 1),
(238, 'Melyik zeneszerző írta a „Szevillai borbélyt”?', 'Rossini', 'Verdi', 'Puccini', 'Bizet', 4, 'Komikus opera', 2),
(239, 'Ki volt a „Carmen” zeneszerzője?', 'Bizet', 'Verdi', 'Puccini', 'Rossini', 4, 'Francia opera tragikus hősnővel', 2),
(240, 'Ki volt az első magyar olimpiai bajnok?', 'Hajós Alfréd', 'Puskás Tivadar', 'Kemény Dénes', 'Egerszegi Krisztina', 5, '1896-ban úszásban nyert', 2),
(241, 'Melyik sportban van „büntetőlap”?', 'Foci', 'Kézilabda', 'Kosárlabda', 'Vízilabda', 5, 'Sárga és piros lap is létezik', 1),
(242, 'Ki nyerte a 2022-es labdarúgó-világbajnokságot?', 'Argentína', 'Franciaország', 'Brazília', 'Németország', 5, 'Messi vezette a csapatot', 2),
(243, 'Melyik országban született Roger Federer?', 'Svájc', 'Németország', 'Franciaország', 'Ausztria', 5, 'Többszörös Grand Slam-bajnok', 2),
(244, 'Mikor rendeztek először téli olimpiát?', '1924', '1936', '1948', '1956', 5, 'Chamonix volt a helyszín', 2),
(245, 'Melyik városban található a Louvre?', 'Párizs', 'London', 'Madrid', 'Róma', 2, 'A világ egyik legnagyobb múzeuma', 1),
(246, 'Ki volt a „Feltámadott a tenger” költője?', 'Petőfi Sándor', 'Vörösmarty Mihály', 'Arany János', 'Ady Endre', 3, 'A szabadságot élteti', 1),
(247, 'Melyik országban van az Uluru szikla?', 'Ausztrália', 'USA', 'India', 'Mexikó', 2, 'Más néven Ayers Rock', 2),
(248, 'Ki volt az, aki bevezette a forintot 1946-ban?', 'Rákosi Mátyás', 'Tildy Zoltán', 'Nagy Ferenc', 'Antall József', 1, 'A pengő hiperinflációja után', 3),
(249, 'Ki írta a „Parasztbiblia” című művet?', 'Illyés Gyula', 'Tamási Áron', 'Németh László', 'Örkény István', 3, 'A népi irodalom fontos alkotása', 3),
(250, 'Melyik zeneszerző írta a „Diótörő”-t?', 'Csajkovszkij', 'Prokofjev', 'Rimszkij-Korszakov', 'Muszorgszkij', 4, 'Karácsonyi balett', 1),
(251, 'Ki volt az utolsó magyar király?', 'IV. Károly', 'II. József', 'Ferenc József', 'I. Lajos', 1, 'Az Osztrák–Magyar Monarchia bukása után uralkodott', 2),
(252, 'Melyik évben omlott le a berlini fal?', '1989', '1991', '1979', '1993', 1, 'A hidegháború végét jelezte', 1),
(253, 'Mikor egyesült Buda, Pest és Óbuda?', '1873', '1848', '1918', '1901', 1, 'Ekkor jött létre Budapest', 2),
(254, 'Mikor tört ki az 1848-as szabadságharc?', '1848. március 15.', '1867', '1830', '1919', 1, 'A forradalom napja', 1),
(255, 'Ki volt Mátyás király apja?', 'Hunyadi János', 'Zrínyi Miklós', 'Kossuth Lajos', 'I. Ulászló', 1, 'A nándorfehérvári hős', 1),
(256, 'Melyik ország fővárosa Lima?', 'Peru', 'Chile', 'Ecuador', 'Venezuela', 2, 'Dél-amerikai város a Csendes-óceán partján', 1),
(257, 'Melyik ország zászlaján van juharlevél?', 'Kanada', 'Mexikó', 'USA', 'Finnország', 2, 'Észak-amerikai ország szimbóluma', 1),
(258, 'Melyik hegység húzódik Nepál és Kína között?', 'Himalája', 'Andok', 'Kaukázus', 'Alpok', 2, 'A világ legmagasabb hegylánca', 1),
(259, 'Melyik tenger határolja Olaszország nyugati partját?', 'Tirrén-tenger', 'Földközi-tenger', 'Adriai-tenger', 'Fekete-tenger', 2, 'A Földközi-tenger része', 2),
(260, 'Melyik ország fővárosa Pretoria?', 'Dél-afrikai Köztársaság', 'Nigéria', 'Kenya', 'Botswana', 2, 'Három fővárosa is van', 3),
(261, 'Ki írta a „Szigeti veszedelem” című művet?', 'Zrínyi Miklós', 'Balassi Bálint', 'Arany János', 'Vörösmarty Mihály', 3, 'Eposz a török elleni harcról', 3),
(262, 'Ki írta a „Nyomorultak” című regényt?', 'Victor Hugo', 'Balzac', 'Zola', 'Dumas', 3, 'Francia klasszikus regény', 1),
(263, 'Melyik mű szerzője Móricz Zsigmond?', 'Légy jó mindhalálig', 'Pál utcai fiúk', 'Egri csillagok', 'Arany ember', 3, 'Debreceni diák története', 1),
(264, 'Ki írta a „Hazám” című verset?', 'Vörösmarty Mihály', 'Petőfi Sándor', 'Ady Endre', 'Babits Mihály', 3, 'Romantikus költő hazafias műve', 2),
(265, 'Ki volt a „Nincsen apám, se anyám” költője?', 'József Attila', 'Ady Endre', 'Radnóti Miklós', 'Kosztolányi Dezső', 3, 'Modern magyar líra', 1),
(266, 'Ki szerezte a „Bolero” zeneművet?', 'Ravel', 'Debussy', 'Bizet', 'Saint-Saëns', 4, 'Francia impresszionista zeneszerző', 2),
(267, 'Ki írta a „Tavaszi szél vizet áraszt” dallamot?', 'Ismeretlen népdal', 'Bartók Béla', 'Kodály Zoltán', 'Liszt Ferenc', 4, 'Magyar népdal', 1),
(268, 'Ki komponálta a „Figaro házassága” című operát?', 'Mozart', 'Verdi', 'Puccini', 'Rossini', 4, 'Vígjáték alapú opera', 1),
(269, 'Melyik zeneszerző a „Zene egy katedrális számára” szerzője?', 'Messiaen', 'Ravel', 'Satie', 'Debussy', 4, '20. századi francia mű', 3),
(270, 'Ki írta a „Holdfény szonáta”-t?', 'Beethoven', 'Mozart', 'Haydn', 'Chopin', 4, 'Romantikus zongoramű', 1),
(271, 'Melyik sportban használják a „touchdown” kifejezést?', 'Amerikai foci', 'Rögbi', 'Krikett', 'Kosárlabda', 5, '6 pontot ér', 2),
(272, 'Melyik sporthoz köthető Rafael Nadal?', 'Tenisz', 'Kerékpár', 'Asztalitenisz', 'Squash', 5, 'Spanyol sportoló', 1),
(273, 'Ki nyerte a legtöbb aranyérmet az olimpiák történetében?', 'Michael Phelps', 'Usain Bolt', 'Larisa Latinyina', 'Carl Lewis', 5, 'Úszó világrekorder', 3),
(274, 'Melyik sportban van „szerválás”?', 'Tenisz', 'Kosárlabda', 'Vízilabda', 'Foci', 5, 'A játék kezdő mozdulata', 1),
(275, 'Ki volt az első nő, aki olimpiai aranyérmet nyert Magyarországnak?', 'Gerevich Ilona', 'Keleti Ágnes', 'Egerszegi Krisztina', 'Kovács Katalin', 5, 'Torna sportoló', 3),
(276, 'Melyik ország fővárosa Varsó?', 'Lengyelország', 'Szlovákia', 'Csehország', 'Ukrajna', 2, 'Közép-európai ország', 1),
(277, 'Melyik városban található a Kreml?', 'Moszkva', 'Szentpétervár', 'Minszk', 'Kijev', 2, 'Orosz kormányzati központ', 1),
(278, 'Melyik országban található az Andok hegység?', 'Dél-Amerika több országában', 'Európa', 'Afrika', 'Ázsia', 2, 'A világ leghosszabb lánchegysége', 2),
(279, 'Melyik országban van a Viktória-vízesés?', 'Zimbabwe és Zambia', 'Dél-Afrika', 'Namíbia', 'Etiópia', 2, 'Afrika egyik legnagyobb természeti látványossága', 3),
(280, 'Melyik tenger partján van Athén?', 'Égei-tenger', 'Adriai-tenger', 'Földközi-tenger', 'Fekete-tenger', 2, 'Görögország fővárosa', 2),
(281, 'Melyik évben történt a mohácsi csata?', '1526', '1241', '1703', '1848', 1, 'A magyar középkor végének kezdete', 1),
(282, 'Mikor volt a Rákóczi-szabadságharc?', '1703–1711', '1848–1849', '1914–1918', '1686–1699', 1, 'A Habsburg-ellenes felkelés ideje', 2),
(283, 'Ki volt a „Honfoglalás” vezére?', 'Árpád', 'Géza', 'Szent István', 'Lehel', 1, 'A magyar törzsek vezetője', 1),
(284, 'Mikor volt a második világháború?', '1939–1945', '1914–1918', '1950–1955', '1920–1930', 1, 'Globális konfliktus', 1),
(285, 'Ki volt a reformáció elindítója?', 'Luther Márton', 'Kálvin János', 'Páduai Szent Antal', 'XVI. Benedek', 1, '1517-ben tételeket szegezett ki', 2),
(286, 'Melyik zeneszerző írta a „Don Giovanni” című operát?', 'Mozart', 'Beethoven', 'Verdi', 'Puccini', 4, 'Klasszikus opera', 2),
(287, 'Ki írta a „Kékszakállú herceg vára” című operát?', 'Bartók Béla', 'Kodály Zoltán', 'Liszt Ferenc', 'Erkel Ferenc', 4, '20. századi magyar opera', 3),
(288, 'Melyik zeneszerző írta a „Carmina Burana”-t?', 'Carl Orff', 'Bach', 'Mozart', 'Beethoven', 4, 'Kórusmű középkori szövegekkel', 3),
(289, 'Ki írta a „Bűn és bűnhődés”-t?', 'Dosztojevszkij', 'Tolsztoj', 'Gogol', 'Csehov', 3, 'Orosz realista regény', 2),
(290, 'Ki írta az „Anna Karenina”-t?', 'Tolsztoj', 'Dosztojevszkij', 'Turgenyev', 'Puskin', 3, 'Orosz klasszikus mű', 2),
(291, 'Ki írta a „Trisztán és Izolda” operát?', 'Wagner', 'Mozart', 'Verdi', 'Beethoven', 4, 'Német romantikus opera', 3),
(292, 'Melyik sportban van „büntetőpont”?', 'Judo', 'Vívás', 'Kosárlabda', 'Tenisz', 5, 'Küzdősportos szabály', 3),
(293, 'Melyik sportban van „ütőfa”?', 'Krikett', 'Golf', 'Baseball', 'Hoki', 5, 'Brit eredetű sport', 2),
(294, 'Ki volt az első magyar Nobel-díjas?', 'Szent-Györgyi Albert', 'Békésy György', 'Wigner Jenő', 'Hevesy György', 1, '1937-ben kapta', 2),
(295, 'Ki alapította a Római Birodalmat?', 'Augustus', 'Julius Caesar', 'Néró', 'Traianus', 1, 'Az első császár', 2),
(296, 'Mikor volt a honfoglalás?', '895', '1000', '1241', '1526', 1, 'A magyar törzsek bejövetele', 1),
(297, 'Ki volt a „Szeptember végén” költője?', 'Petőfi Sándor', 'Arany János', 'Vörösmarty Mihály', 'Ady Endre', 3, 'Személyes hangvételű szerelmes vers', 1),
(298, 'Ki írta a „Bűvös vadász” operát?', 'Weber', 'Beethoven', 'Mozart', 'Haydn', 4, 'Korai romantikus opera', 3),
(299, 'Ki szerezte a „Hattyúk tava” balettet?', 'Csajkovszkij', 'Prokofjev', 'Rimszkij-Korszakov', 'Muszorgszkij', 4, 'Orosz klasszikus balett', 1),
(300, 'Ki volt a „Himnusz” zeneszerzője?', 'Erkel Ferenc', 'Liszt Ferenc', 'Kodály Zoltán', 'Bartók Béla', 4, 'A magyar nemzeti himnusz zenéje', 1),
(301, 'Ki vezette a rómaiakat Galliában?', 'Julius Caesar', 'Néró', 'Augustus', 'Traianus', 1, 'A gall háborúk hadvezére', 3),
(302, 'Melyik évben zajlott a vízkereszti csata?', '1312', '1241', '1456', '1526', 1, 'Károly Róbert győzelme Csák Máté ellen', 3),
(303, 'Ki volt az Árpád-ház utolsó királya?', 'III. András', 'IV. Béla', 'II. András', 'I. László', 1, 'A dinasztia kihalásával zárult a korszak', 3),
(304, 'Melyik magyar uralkodó alatt történt a tatárjárás?', 'IV. Béla', 'III. Béla', 'II. András', 'V. István', 1, '1241-ben kezdődött', 2),
(305, 'Mikor volt a nándorfehérvári diadal?', '1456', '1526', '1241', '1703', 1, 'Török elleni győzelem Hunyadi János vezetésével', 2),
(306, 'Melyik ország volt gyarmatbirodalom a 19. században?', 'Nagy-Britannia', 'Spanyolország', 'Portugália', 'Hollandia', 2, 'A Brit Birodalom csúcspontja', 2),
(307, 'Melyik folyó szeli át Kairót?', 'Nílus', 'Amazonas', 'Gangesz', 'Eufrátesz', 2, 'Afrika leghosszabb folyója', 1),
(308, 'Hol található a Viktória-tó?', 'Afrikában', 'Ázsiában', 'Európában', 'Amerikában', 2, 'A kontinens legnagyobb tava', 2),
(309, 'Melyik hegység húzódik az USA nyugati részén?', 'Sziklás-hegység', 'Appalache', 'Andok', 'Alpok', 2, 'Észak-Amerika gerince', 1),
(310, 'Melyik ország fővárosa Buenos Aires?', 'Argentína', 'Brazília', 'Uruguay', 'Chile', 2, 'A tangó hazája', 1),
(311, 'Melyik országban található Machu Picchu?', 'Peru', 'Mexikó', 'Bolívia', 'Kolumbia', 2, 'Inka romváros a hegyekben', 2),
(312, 'Melyik ország fővárosa Reykjavík?', 'Izland', 'Norvégia', 'Finnország', 'Svédország', 2, 'Egy vulkanikus szigetország városa', 3),
(313, 'Melyik irodalmi mű szerzője Cervantes?', 'Don Quijote', 'Candide', 'Az arany virágcserép', 'Párizsi Notre-Dame', 3, 'Spanyol reneszánsz regény', 1),
(314, 'Ki írta a „Bűn és bűnhődés” című regényt?', 'Dosztojevszkij', 'Tolsztoj', 'Gogol', 'Puskin', 3, 'Lélektani orosz regény', 2),
(315, 'Ki írta az „Isteni színjáték”-ot?', 'Dante Alighieri', 'Boccaccio', 'Petrarca', 'Shakespeare', 3, 'Középkori olasz eposz', 2),
(316, 'Melyik mű nem Ady Endréhez köthető?', 'Családi kör', 'A magyar Ugaron', 'Lédával a bálban', 'Héja-nász az avaron', 3, 'Más szerző írta', 3),
(317, 'Ki volt az „Ember tragédiája” szerzője?', 'Madách Imre', 'Katona József', 'Arany János', 'Vörösmarty Mihály', 3, 'Filozófiai dráma', 1),
(318, 'Ki írta az „Anyegin”-t?', 'Puskin', 'Lermontov', 'Tolsztoj', 'Turgenyev', 3, 'Verses regény orosz klasszikus tollából', 2),
(319, 'Melyik zeneszerző műve a „Tavaszi áldozat”?', 'Stravinsky', 'Debussy', 'Ravel', 'Bartók', 4, '20. századi avantgárd darab', 3),
(320, 'Ki komponálta a „Nabucco”-t?', 'Verdi', 'Puccini', 'Rossini', 'Bizet', 4, 'Olasz opera', 2),
(321, 'Ki írta a „Szimfónia a világ végére” művet?', 'Mahler', 'Bruckner', 'Wagner', 'Schoenberg', 4, 'Romantikus szimfónia', 3),
(322, 'Melyik zeneszerző írta a „Máté-passió”-t?', 'Bach', 'Beethoven', 'Mozart', 'Haydn', 4, 'Barokk mestermű', 2),
(323, 'Ki írta a „Concerto”-t vonósokra?', 'Bartók Béla', 'Kodály Zoltán', 'Liszt Ferenc', 'Erkel Ferenc', 4, '20. századi magyar kompozíció', 2),
(324, 'Ki volt Mozart kortársa?', 'Haydn', 'Schumann', 'Brahms', 'Mahler', 4, 'Mindketten bécsi klasszikusok', 1),
(325, 'Melyik sportban van „ütő és labda” egyszerre?', 'Krikett', 'Tenisz', 'Golf', 'Jégkorong', 5, 'Angolszász eredetű sport', 1),
(326, 'Ki volt Michael Schumacher?', 'Forma–1 pilóta', 'Futballista', 'Kosárlabdázó', 'Teniszező', 5, 'Hétszeres világbajnok', 1),
(327, 'Melyik sportágban használják a „dobókör” kifejezést?', 'Súlylökés', 'Távolugrás', 'Futás', 'Vívás', 5, 'Atlétikai szám', 1),
(328, 'Ki volt Puskás Ferenc?', 'Labdarúgó', 'Kosárlabdázó', 'Jégkorongozó', 'Bokszoló', 5, 'A „Száguldó őrnagy”', 1),
(329, 'Ki nyerte az első modern olimpiát?', 'Spyridon Louis', 'Jesse Owens', 'Jim Thorpe', 'Pierre de Coubertin', 5, '1896-ban Athénban', 2),
(330, 'Melyik sportban van „palánk”?', 'Kosárlabda', 'Röplabda', 'Kézilabda', 'Baseball', 5, 'A gyűrű mögött található', 1),
(331, 'Melyik évben volt a Waterloo-i csata?', '1815', '1805', '1799', '1821', 1, 'Napóleon végső veresége', 2),
(332, 'Ki volt az 1848-as forradalom idején a magyar kormányzó-elnök?', 'Kossuth Lajos', 'Széchenyi István', 'Deák Ferenc', 'Batthyány Lajos', 1, 'A forradalom vezetője', 2),
(333, 'Melyik király uralkodása alatt lett Magyarország keresztény állam?', 'Szent István', 'I. László', 'IV. Béla', 'I. Károly', 1, 'Államalapító', 1),
(334, 'Ki volt a római birodalom első császára?', 'Augustus', 'Caesar', 'Tiberius', 'Néró', 1, 'Octavianus néven született', 2),
(335, 'Mikor omlott össze a Nyugat-Római Birodalom?', '476', '410', '395', '530', 1, 'A középkor kezdete', 3),
(336, 'Melyik ország fővárosa Nairobi?', 'Kenya', 'Tanzánia', 'Uganda', 'Etiópia', 2, 'Afrikai ország', 1),
(337, 'Hol található a Kilimandzsáró?', 'Tanzánia', 'Kenya', 'Etiópia', 'Uganda', 2, 'Afrika legmagasabb hegye', 2),
(338, 'Melyik országban van a Titicaca-tó?', 'Peru és Bolívia', 'Chile', 'Argentína', 'Venezuela', 2, 'A világ legmagasabban fekvő tava', 2),
(339, 'Melyik kontinensen található a Namíb-sivatag?', 'Afrika', 'Ausztrália', 'Ázsia', 'Dél-Amerika', 2, 'A világ egyik legidősebb sivataga', 3),
(340, 'Ki írta a „Föld alatti Magyarország” művet?', 'Illyés Gyula', 'Móricz Zsigmond', 'Kosztolányi Dezső', 'Tamási Áron', 3, 'Társadalomkritikus esszé', 3),
(341, 'Ki írta az „Aranysárkány”-t?', 'Kosztolányi Dezső', 'Ady Endre', 'Jókai Mór', 'Mikszáth Kálmán', 3, 'Modern magyar regény', 2),
(342, 'Ki írta a „Pillangókisasszony”-t zenében?', 'Puccini', 'Verdi', 'Rossini', 'Bizet', 4, 'Tragikus szerelmi történet', 2),
(343, 'Ki szerezte a „Kékszakállú herceg vára” című operát?', 'Bartók Béla', 'Erkel Ferenc', 'Kodály Zoltán', 'Liszt Ferenc', 4, 'Magyar modern mű', 3),
(344, 'Melyik zeneszerző írta a „Zarándokévek” zongoraciklust?', 'Liszt Ferenc', 'Beethoven', 'Schubert', 'Chopin', 4, 'Romantikus műsorozat', 2),
(345, 'Ki komponálta a „9. szimfóniát”?', 'Beethoven', 'Bach', 'Mozart', 'Mahler', 4, '„Örömóda” benne található', 1),
(346, 'Ki írta a „Tündér Lalát”?', 'Vörösmarty Mihály', 'Arany János', 'Jókai Mór', 'Madách Imre', 3, 'Romantikus eposz', 3),
(347, 'Ki írta a „Felhők” című verset?', 'József Attila', 'Ady Endre', 'Kosztolányi Dezső', 'Babits Mihály', 3, 'Modern költészet', 2),
(348, 'Ki volt Kodály Zoltán zeneszerző kortársa?', 'Bartók Béla', 'Liszt Ferenc', 'Erkel Ferenc', 'Haydn', 4, 'Mindketten népzenét gyűjtöttek', 1),
(349, 'Ki írta a „Porgy és Bess” operát?', 'Gershwin', 'Bernstein', 'Ellington', 'Porter', 4, 'Amerikai jazzopera', 3),
(350, 'Melyik sportban szerepel a „büntetődobás”?', 'Kosárlabda', 'Vízilabda', 'Foci', 'Kézilabda', 5, 'Dobás pontért', 1),
(351, 'Ki volt az első Habsburg magyar király?', 'I. Ferdinánd', 'II. József', 'I. Lipót', 'III. Károly', 1, 'Mohács után került trónra', 3),
(352, 'Melyik évben történt a mohácsi vész?', '1526', '1241', '1456', '1703', 1, 'A középkori Magyarország tragédiája', 1),
(353, 'Ki volt az „Európa bölcse”?', 'Széchenyi István', 'Kossuth Lajos', 'Deák Ferenc', 'Batthyány Lajos', 1, 'A reformkor nagy alakja', 2),
(354, 'Mikor volt az 1849-es szabadságharc vége?', '1849', '1848', '1850', '1867', 1, 'A Habsburgok leverték a felkelést', 2),
(355, 'Ki vezette a honfoglaló magyarokat?', 'Árpád', 'Szent István', 'Lehel', 'Koppány', 1, 'A magyar törzsek fejedelme', 1),
(356, 'Melyik ország fővárosa Lisszabon?', 'Portugália', 'Spanyolország', 'Olaszország', 'Görögország', 2, 'Az Ibériai-félsziget nyugati végén', 1),
(357, 'Hol található a Szahra sivatag?', 'Afrika', 'Ausztrália', 'Ázsia', 'Dél-Amerika', 2, 'A világ legnagyobb sivataga', 2),
(358, 'Melyik folyó ered az Alpokban és ömlik a Fekete-tengerbe?', 'Duna', 'Tisza', 'Rajna', 'Volga', 2, 'Közép-Európa jelentős folyója', 1),
(359, 'Melyik országban található a Mount Kilimanjaro?', 'Tanzánia', 'Kenya', 'Uganda', 'Etiópia', 2, 'Afrika legmagasabb csúcsa', 2),
(360, 'Melyik földrész legnagyobb a terület alapján?', 'Ázsia', 'Afrika', 'Európa', 'Amerika', 2, 'A legnépesebb kontinens is', 1),
(361, 'Ki írta a „Kárpáti kódex” című regényt?', 'Mikszáth Kálmán', 'Jókai Mór', 'Ady Endre', 'Babits Mihály', 3, 'Humoros történet a vidékről', 2),
(362, 'Ki írta a „Légy jó mindhalálig”-t?', 'Móricz Zsigmond', 'Jókai Mór', 'Mikszáth Kálmán', 'Kosztolányi Dezső', 3, 'Ifjúsági regény', 1),
(363, 'Ki írta a „Fekete gyémántok” regényt?', 'Jókai Mór', 'Mikszáth Kálmán', 'Gárdonyi Géza', 'Illyés Gyula', 3, 'Magyar történelmi regény', 2),
(364, 'Ki írta a „Szeptember végén” című verset?', 'Petőfi Sándor', 'Arany János', 'József Attila', 'Babits Mihály', 3, 'Szerelmes költemény', 1),
(365, 'Ki komponálta a „Diótörő”-t?', 'Csajkovszkij', 'Beethoven', 'Mozart', 'Bartók', 4, 'Karácsonyi balett', 1),
(366, 'Ki írta a „Hunyadi László” operát?', 'Erkel Ferenc', 'Liszt Ferenc', 'Kodály Zoltán', 'Bartók Béla', 4, 'Romantikus magyar opera', 2),
(367, 'Melyik zeneszerző írta a „Rákóczi-induló”-t?', 'Erkel Ferenc', 'Bartók Béla', 'Liszt Ferenc', 'Kodály Zoltán', 4, 'Magyar nemzeti induló', 1),
(368, 'Ki komponálta a „Kékszakállú herceg vára”-t?', 'Bartók Béla', 'Kodály Zoltán', 'Liszt Ferenc', 'Erkel Ferenc', 4, '20. századi magyar opera', 3),
(369, 'Melyik zeneszerző írta a „Boléro”-t?', 'Ravel', 'Debussy', 'Saint-Saëns', 'Satie', 4, 'Impresszionista darab', 3),
(370, 'Ki volt az olimpiai úszólegenda Michael Phelps?', 'USÁ-ból', 'Németország', 'Ausztrália', 'Franciaország', 5, 'A legtöbb aranyérmet nyerte', 3),
(371, 'Ki volt az első magyar olimpiai bajnok?', 'Hajós Alfréd', 'Puskás Tivadar', 'Kemény Dénes', 'Egerszegi Krisztina', 5, '1896-ban úszásban nyert', 2);
INSERT INTO `kerdesek` (`kerdesek_id`, `kerdesek_kerdes`, `kerdesek_helyesValasz`, `kerdesek_helytelenValasz1`, `kerdesek_helytelenValasz2`, `kerdesek_helytelenValasz3`, `kerdesek_kategoria`, `kerdesek_leiras`, `kerdesek_nehezseg`) VALUES
(372, 'Melyik sportban van „sarokrúgás”?', 'Labdarúgás', 'Kosárlabda', 'Kézilabda', 'Rögbi', 5, 'Pontszerzés módja', 1),
(373, 'Ki nyerte a legtöbb labdarúgó-világbajnokságot?', 'Brazília', 'Argentína', 'Németország', 'Olaszország', 5, 'FIFA VB történet', 2),
(374, 'Melyik sportban használják a „szerva” kifejezést?', 'Tenisz', 'Kézilabda', 'Kosárlabda', 'Vízilabda', 5, 'Játék kezdése', 1),
(375, 'Ki volt a legenda Puskás Ferenc?', 'Labdarúgó', 'Kosárlabdázó', 'Jégkorongozó', 'Teniszező', 5, '„Száguldó őrnagy”', 1),
(376, 'Melyik sportban van touchdown?', 'Amerikai foci', 'Rögbi', 'Foci', 'Kézilabda', 5, 'Pontszerzés', 2),
(377, 'Melyik ország fővárosa Madrid?', 'Spanyolország', 'Portugália', 'Olaszország', 'Franciaország', 2, 'Iberiai félszigeti város', 1),
(378, 'Melyik városban található a Szent Péter bazilika?', 'Vatikán', 'Róma', 'Milánó', 'Firenze', 2, 'Katolikus vallási központ', 1),
(379, 'Hol található a Niagara-vízesés?', 'USA és Kanada', 'Mexikó', 'Brazília', 'Argentína', 2, 'Észak-amerikai híres vízesés', 2),
(380, 'Melyik ország zászlaja piros-fehér-zöld?', 'Magyarország', 'Olaszország', 'Bulgária', 'Mexikó', 2, 'Magyar nemzeti színek', 1),
(381, 'Ki írta a „Családi kör”-t?', 'Ady Endre', 'József Attila', 'Babits Mihály', 'Kosztolányi Dezső', 3, 'Modern magyar költő', 2),
(382, 'Ki írta a „Légy jó mindhalálig”-t?', 'Móricz Zsigmond', 'Jókai Mór', 'Mikszáth Kálmán', 'Ady Endre', 3, 'Ifjúsági regény', 1),
(383, 'Ki írta a „Nyugat” folyóiratot alapító verseket?', 'Ady Endre', 'József Attila', 'Kosztolányi Dezső', 'Babits Mihály', 3, 'Modern magyar irodalom', 2),
(384, 'Ki komponálta a „Porgy és Bess”-t?', 'Gershwin', 'Bernstein', 'Porter', 'Ellington', 4, 'Amerikai opera', 3),
(385, 'Ki volt a „Diótörő” zeneszerzője?', 'Csajkovszkij', 'Beethoven', 'Mozart', 'Liszt Ferenc', 4, 'Karácsonyi balett', 1),
(386, 'Melyik zeneszerző írta a „Kékszakállú herceg vára”-t?', 'Bartók Béla', 'Kodály Zoltán', 'Liszt Ferenc', 'Erkel Ferenc', 4, '20. századi magyar opera', 3),
(387, 'Melyik sportban van „büntetődobás”?', 'Kosárlabda', 'Foci', 'Kézilabda', 'Vízilabda', 5, 'Pontszerzés', 1),
(388, 'Ki volt az első magyar női olimpiai aranyérmes?', 'Keleti Ágnes', 'Gerevich Ilona', 'Egerszegi Krisztina', 'Kovács Katalin', 5, 'Torna sportoló', 3),
(389, 'Ki nyerte a 2022-es labdarúgó-világbajnokságot?', 'Argentína', 'Franciaország', 'Brazília', 'Németország', 5, 'Messi vezette a csapatot', 2),
(390, 'Ki volt Roger Federer?', 'Svájci teniszező', 'Német', 'Ausztrál', 'Francia', 5, 'Többszörös Grand Slam-bajnok', 2),
(391, 'Mikor rendeztek először téli olimpiát?', '1924', '1936', '1948', '1956', 5, 'Chamonix', 2),
(392, 'Ki írta a „Bánk bán”-t?', 'Katona József', 'Jókai Mór', 'Arany János', 'Vörösmarty Mihály', 3, 'Híres dráma', 2),
(393, 'Ki írta a „Toldi”-t?', 'Arany János', 'Petőfi Sándor', 'Jókai Mór', 'Vörösmarty Mihály', 3, 'Eposz', 1),
(394, 'Ki írta a „Bűn és bűnhődés”-t?', 'Dosztojevszkij', 'Tolsztoj', 'Gogol', 'Csehov', 3, 'Orosz klasszikus', 2),
(395, 'Ki komponálta a „9. szimfóniát”?', 'Beethoven', 'Mozart', 'Bach', 'Haydn', 4, 'Örömóda', 1),
(396, 'Ki volt a „Tavaszi szonáta” szerzője?', 'Beethoven', 'Mozart', 'Liszt Ferenc', 'Haydn', 4, 'Hegedűszonáta', 2),
(397, 'Ki írta a „Parasztbiblia”-t?', 'Illyés Gyula', 'Tamási Áron', 'Németh László', 'Örkény István', 3, 'Népi irodalom', 3),
(398, 'Melyik ország fővárosa Tokió?', 'Japán', 'Kína', 'Korea', 'Vietnam', 2, 'Ázsia', 1),
(399, 'Ki komponálta az „Esti Kornél” zenéjét?', 'Kosztolányi Dezső', 'Babits Mihály', 'József Attila', 'Arany János', 3, 'Novellaciklus', 2),
(400, 'Ki írta a „Hazám, hazám”-t?', 'Erkel Ferenc', 'Liszt Ferenc', 'Kodály Zoltán', 'Bartók Béla', 4, 'Opera', 2),
(401, 'Melyik csata történt 1526-ban?', 'Mohácsi csata', 'Nándorfehérvár', 'Pozsonyi csata', 'Szigetvári csata', 1, 'A középkori Magyarország tragédiája', 3),
(402, 'Ki volt az első magyar király?', 'Szent István', 'IV. Béla', 'I. László', 'Hunyadi Mátyás', 1, 'Az államalapító', 1),
(403, 'Melyik magyar király koronázása zajlott Esztergomban?', 'IV. Béla', 'III. András', 'I. Károly', 'II. Lajos', 1, 'A tatárjárás utáni időszak', 2),
(404, 'Mikor kezdődött a Rákóczi-szabadságharc?', '1703', '1848', '1526', '1711', 1, 'A Habsburgok ellen', 2),
(405, 'Ki volt Hunyadi János?', 'Hadvezér', 'Király', 'Bíró', 'Pap', 1, 'A török elleni védelmező', 3),
(406, 'Melyik ország fővárosa Ankara?', 'Törökország', 'Görögország', 'Szaúd-Arábia', 'Irán', 2, 'Anatólia szíve', 2),
(407, 'Melyik folyó folyik Budapesten keresztül?', 'Duna', 'Tisza', 'Rába', 'Dráva', 2, 'Két partja Buda és Pest', 1),
(408, 'Hol található a Grand Canyon?', 'USA', 'Mexikó', 'Kanada', 'Brazília', 2, 'Arizona híres kanyonja', 2),
(409, 'Melyik országban van a Victoria-tó?', 'Tanzánia', 'Kenya', 'Uganda', 'Etiópia', 2, 'Afrika legnagyobb tava', 2),
(410, 'Melyik ország fővárosa Hanoj?', 'Vietnam', 'Thaiföld', 'Kambodzsa', 'Laosz', 2, 'Indokína', 3),
(411, 'Ki írta a „Tóték”-at?', 'Örkény István', 'Mikszáth Kálmán', 'Jókai Mór', 'Ady Endre', 3, 'Rövid humoros dráma', 2),
(412, 'Ki írta a „Felelet a Földnek”-et?', 'Móricz Zsigmond', 'Illyés Gyula', 'Jókai Mór', 'Kosztolányi Dezső', 3, 'Szociális regény', 3),
(413, 'Ki írta a „Légy jó mindhalálig”-t?', 'Móricz Zsigmond', 'Jókai Mór', 'Ady Endre', 'Babits Mihály', 3, 'Ifjúsági regény', 1),
(414, 'Ki írta a „Bánk bán”-t?', 'Katona József', 'Jókai Mór', 'Arany János', 'Vörösmarty Mihály', 3, 'Híres magyar dráma', 2),
(415, 'Ki komponálta a „Diótörő”-t?', 'Csajkovszkij', 'Beethoven', 'Mozart', 'Liszt Ferenc', 4, 'Karácsonyi balett', 1),
(416, 'Ki komponálta a „Hunyadi László” operát?', 'Erkel Ferenc', 'Liszt Ferenc', 'Bartók Béla', 'Kodály Zoltán', 4, 'Romantikus magyar opera', 2),
(417, 'Ki komponálta a „Máté-passió”-t?', 'Bach', 'Beethoven', 'Mozart', 'Haydn', 4, 'Barokk mestermű', 2),
(418, 'Ki írta a „Concerto”-t vonósokra?', 'Bartók Béla', 'Kodály Zoltán', 'Liszt Ferenc', 'Erkel Ferenc', 4, '20. századi magyar kompozíció', 2),
(419, 'Ki volt Haydn kortársa?', 'Mozart', 'Beethoven', 'Brahms', 'Mahler', 4, 'Bécsi klasszikus', 1),
(420, 'Melyik sportágban van „ütő és labda” egyszerre?', 'Krikett', 'Tenisz', 'Golf', 'Jégkorong', 5, 'Angolszász eredetű sport', 1),
(421, 'Ki volt Michael Schumacher?', 'Forma–1 pilóta', 'Futballista', 'Kosárlabdázó', 'Teniszező', 5, 'Hétszeres világbajnok', 1),
(422, 'Melyik sportban használják a „dobókör” kifejezést?', 'Súlylökés', 'Távolugrás', 'Futás', 'Vívás', 5, 'Atlétikai szám', 1),
(423, 'Ki volt Puskás Ferenc?', 'Labdarúgó', 'Kosárlabdázó', 'Jégkorongozó', 'Bokszoló', 5, '„Száguldó őrnagy”', 1),
(424, 'Ki nyerte az első modern olimpiát?', 'Spyridon Louis', 'Jesse Owens', 'Jim Thorpe', 'Pierre de Coubertin', 5, '1896-ban Athénban', 2),
(425, 'Melyik sportban van „palánk”?', 'Kosárlabda', 'Röplabda', 'Kézilabda', 'Baseball', 5, 'A gyűrű mögött található', 1),
(426, 'Mikor volt a Waterloo-i csata?', '1815', '1805', '1799', '1821', 1, 'Napóleon végső veresége', 2),
(427, 'Ki volt az 1848-as forradalom idején a kormányzó-elnök?', 'Kossuth Lajos', 'Széchenyi István', 'Deák Ferenc', 'Batthyány Lajos', 1, 'A forradalom vezetője', 2),
(428, 'Melyik király alatt lett Magyarország keresztény állam?', 'Szent István', 'I. László', 'IV. Béla', 'I. Károly', 1, 'Államalapító', 1),
(429, 'Ki volt a római birodalom első császára?', 'Augustus', 'Caesar', 'Tiberius', 'Néró', 1, 'Octavianus néven született', 2),
(430, 'Mikor omlott össze a Nyugat-Római Birodalom?', '476', '410', '395', '530', 1, 'A középkor kezdete', 3),
(431, 'Melyik ország fővárosa Nairobi?', 'Kenya', 'Tanzánia', 'Uganda', 'Etiópia', 2, 'Afrika', 1),
(432, 'Hol található a Kilimandzsáró?', 'Tanzánia', 'Kenya', 'Etiópia', 'Uganda', 2, 'Afrika legmagasabb hegye', 2),
(433, 'Melyik országban van a Titicaca-tó?', 'Peru és Bolívia', 'Chile', 'Argentína', 'Venezuela', 2, 'A világ legmagasabban fekvő tava', 2),
(434, 'Melyik kontinensen található a Namíb-sivatag?', 'Afrika', 'Ausztrália', 'Ázsia', 'Dél-Amerika', 2, 'A világ egyik legidősebb sivataga', 3),
(435, 'Ki írta a „Föld alatti Magyarország”-t?', 'Illyés Gyula', 'Móricz Zsigmond', 'Kosztolányi Dezső', 'Tamási Áron', 3, 'Szociális regény', 3),
(436, 'Ki írta az „Aranysárkány”-t?', 'Kosztolányi Dezső', 'Ady Endre', 'Jókai Mór', 'Mikszáth Kálmán', 3, 'Modern magyar regény', 2),
(437, 'Ki írta a „Pillangókisasszony”-t zenében?', 'Puccini', 'Verdi', 'Rossini', 'Bizet', 4, 'Tragikus szerelmi történet', 2),
(438, 'Ki szerezte a „Kékszakállú herceg vára”-t?', 'Bartók Béla', 'Erkel Ferenc', 'Kodály Zoltán', 'Liszt Ferenc', 4, 'Magyar modern mű', 3),
(439, 'Melyik zeneszerző írta a „Zarándokévek” zongoraciklust?', 'Liszt Ferenc', 'Beethoven', 'Schubert', 'Chopin', 4, 'Romantikus műsorozat', 2),
(440, 'Ki komponálta a „9. szimfóniát”?', 'Beethoven', 'Bach', 'Mozart', 'Mahler', 4, '„Örömóda” benne található', 1),
(441, 'Ki írta a „Tündér Lalát”?', 'Vörösmarty Mihály', 'Arany János', 'Jókai Mór', 'Madách Imre', 3, 'Romantikus eposz', 3),
(442, 'Ki írta a „Felhők”-et?', 'József Attila', 'Ady Endre', 'Kosztolányi Dezső', 'Babits Mihály', 3, 'Modern költészet', 2),
(443, 'Ki volt Kodály Zoltán kortársa?', 'Bartók Béla', 'Liszt Ferenc', 'Erkel Ferenc', 'Haydn', 4, 'Népzenegyűjtés', 1),
(444, 'Ki írta a „Porgy és Bess”-t?', 'Gershwin', 'Bernstein', 'Ellington', 'Porter', 4, 'Amerikai jazzopera', 3),
(445, 'Melyik sportban van „büntetődobás”?', 'Kosárlabda', 'Vízilabda', 'Foci', 'Kézilabda', 5, 'Pontszerzés', 1),
(446, 'Ki volt az első magyar női olimpiai aranyérmes?', 'Keleti Ágnes', 'Gerevich Ilona', 'Egerszegi Krisztina', 'Kovács Katalin', 5, 'Torna', 3),
(447, 'Ki nyerte a 2022-es labdarúgó-világbajnokságot?', 'Argentína', 'Franciaország', 'Brazília', 'Németország', 5, 'Messi vezette a csapatot', 2),
(448, 'Ki volt Roger Federer?', 'Svájci teniszező', 'Német', 'Ausztrál', 'Francia', 5, 'Többszörös Grand Slam-bajnok', 2),
(449, 'Mikor rendeztek először téli olimpiát?', '1924', '1936', '1948', '1956', 5, 'Chamonix', 2),
(450, 'Ki írta a „Bánk bán”-t?', 'Katona József', 'Jókai Mór', 'Arany János', 'Vörösmarty Mihály', 3, 'Dráma', 2),
(451, 'Ki írta a „Toldi”-t?', 'Arany János', 'Petőfi Sándor', 'Jókai Mór', 'Vörösmarty Mihály', 3, 'Eposz', 1),
(452, 'Ki írta a „Bűn és bűnhődés”-t?', 'Dosztojevszkij', 'Tolsztoj', 'Gogol', 'Csehov', 3, 'Orosz klasszikus', 2),
(453, 'Ki komponálta a „9. szimfóniát”?', 'Beethoven', 'Mozart', 'Bach', 'Haydn', 4, 'Örömóda', 1),
(454, 'Ki volt a „Tavaszi szonáta” szerzője?', 'Beethoven', 'Mozart', 'Liszt Ferenc', 'Haydn', 4, 'Hegedűszonáta', 2),
(455, 'Ki írta a „Parasztbiblia”-t?', 'Illyés Gyula', 'Tamási Áron', 'Németh László', 'Örkény István', 3, 'Népi irodalom', 3),
(456, 'Melyik ország fővárosa Tokió?', 'Japán', 'Kína', 'Korea', 'Vietnam', 2, 'Ázsia', 1),
(457, 'Ki komponálta az „Esti Kornél” zenéjét?', 'Kosztolányi Dezső', 'Babits Mihály', 'József Attila', 'Arany János', 3, 'Novellaciklus', 2),
(458, 'Ki írta a „Hazám, hazám”-t?', 'Erkel Ferenc', 'Liszt Ferenc', 'Kodály Zoltán', 'Bartók Béla', 4, 'Opera', 2),
(459, 'Melyik sportban van „ütővel és labdával, négy bázissal”?', 'Baseball', 'Krikett', 'Tenisz', 'Golf', 5, 'Amerikai csapatsport', 2),
(460, 'Ki volt Muhammad Ali?', 'Bokszoló', 'Futballista', 'Kosárlabdázó', 'Teniszező', 5, 'Legendás ökölvívó', 3),
(461, 'Ki nyerte az első Tour de France-t?', 'Maurice Garin', 'Lemond', 'Coppi', 'Anquetil', 5, 'Kerékpár', 3),
(462, 'Melyik ország zászlaja piros-fehér-zöld?', 'Magyarország', 'Olaszország', 'Bulgária', 'Mexikó', 2, 'Nemzeti színek', 1),
(463, 'Mikor volt a Waterlooi csata?', '1815', '1805', '1799', '1821', 1, 'Napóleon végső veresége', 2),
(464, 'Ki volt az első Habsburg magyar király?', 'I. Ferdinánd', 'II. József', 'I. Lipót', 'III. Károly', 1, 'Mohács után', 3),
(465, 'Melyik ország fővárosa Lisszabon?', 'Portugália', 'Spanyolország', 'Olaszország', 'Görögország', 2, 'Ibériai-félsziget', 1),
(466, 'Hol található a Grand Canyon?', 'USA', 'Mexikó', 'Kanada', 'Brazília', 2, 'Arizona híres kanyonja', 2),
(467, 'Melyik sportágban van touchdown?', 'Amerikai foci', 'Rögbi', 'Foci', 'Kézilabda', 5, 'Pontszerzés', 2),
(468, 'Ki volt az olimpiai úszólegenda Michael Phelps?', 'USA', 'Németország', 'Ausztrália', 'Franciaország', 5, 'Legtöbb aranyérmes', 3),
(469, 'Ki nyerte a legtöbb labdarúgó-világbajnokságot?', 'Brazília', 'Argentína', 'Németország', 'Olaszország', 5, 'FIFA VB', 2),
(470, 'Ki volt az első magyar olimpiai bajnok?', 'Hajós Alfréd', 'Puskás Tivadar', 'Kemény Dénes', 'Egerszegi Krisztina', 5, '1896', 2),
(471, 'Ki írta a „Családi kör”-t?', 'Ady Endre', 'József Attila', 'Babits Mihály', 'Kosztolányi Dezső', 3, 'Modern magyar költő', 2),
(472, 'Ki írta a „Légy jó mindhalálig”-t?', 'Móricz Zsigmond', 'Jókai Mór', 'Mikszáth Kálmán', 'Ady Endre', 3, 'Ifjúsági regény', 1),
(473, 'Ki írta a „Nyugat” folyóiratot alapító verseket?', 'Ady Endre', 'József Attila', 'Kosztolányi Dezső', 'Babits Mihály', 3, 'Modern magyar irodalom', 2),
(474, 'Ki komponálta a „Porgy és Bess”-t?', 'Gershwin', 'Bernstein', 'Ellington', 'Porter', 4, 'Amerikai opera', 3),
(475, 'Ki volt a „Diótörő” zeneszerzője?', 'Csajkovszkij', 'Beethoven', 'Mozart', 'Liszt Ferenc', 4, 'Karácsonyi balett', 1),
(476, 'Melyik zeneszerző írta a „Kékszakállú herceg vára”-t?', 'Bartók Béla', 'Kodály Zoltán', 'Liszt Ferenc', 'Erkel Ferenc', 4, '20. századi magyar opera', 3),
(477, 'Melyik sportban van „büntetődobás”?', 'Kosárlabda', 'Vízilabda', 'Foci', 'Kézilabda', 5, 'Pontszerzés', 1),
(478, 'Ki volt az első magyar női olimpiai aranyérmes?', 'Keleti Ágnes', 'Gerevich Ilona', 'Egerszegi Krisztina', 'Kovács Katalin', 5, 'Torna', 3),
(479, 'Ki nyerte a 2022-es labdarúgó-világbajnokságot?', 'Argentína', 'Franciaország', 'Brazília', 'Németország', 5, 'Messi vezette a csapatot', 2),
(480, 'Ki volt Roger Federer?', 'Svájci teniszező', 'Német', 'Ausztrál', 'Francia', 5, 'Grand Slam-bajnok', 2),
(481, 'Mikor rendeztek először téli olimpiát?', '1924', '1936', '1948', '1956', 5, 'Chamonix', 2),
(482, 'Ki írta a „Bánk bán”-t?', 'Katona József', 'Jókai Mór', 'Arany János', 'Vörösmarty Mihály', 3, 'Dráma', 2),
(483, 'Ki írta a „Toldi”-t?', 'Arany János', 'Petőfi Sándor', 'Jókai Mór', 'Vörösmarty Mihály', 3, 'Eposz', 1),
(484, 'Ki írta a „Bűn és bűnhődés”-t?', 'Dosztojevszkij', 'Tolsztoj', 'Gogol', 'Csehov', 3, 'Orosz klasszikus', 2),
(485, 'Ki komponálta a „9. szimfóniát”?', 'Beethoven', 'Mozart', 'Bach', 'Haydn', 4, '„Örömóda” szerepel benne', 1),
(486, 'Ki volt a „Tavaszi szonáta” szerzője?', 'Beethoven', 'Mozart', 'Liszt Ferenc', 'Haydn', 4, 'Hegedűszonáta', 2),
(487, 'Ki írta a „Parasztbiblia”-t?', 'Illyés Gyula', 'Tamási Áron', 'Németh László', 'Örkény István', 3, 'Népi irodalom', 3),
(488, 'Melyik ország fővárosa Tokió?', 'Japán', 'Kína', 'Korea', 'Vietnam', 2, 'Ázsia', 1),
(489, 'Ki komponálta az „Esti Kornél” zenéjét?', 'Kosztolányi Dezső', 'Babits Mihály', 'József Attila', 'Arany János', 3, 'Novellaciklus', 2),
(490, 'Ki írta a „Hazám, hazám”-t?', 'Erkel Ferenc', 'Liszt Ferenc', 'Kodály Zoltán', 'Bartók Béla', 4, 'Opera', 2),
(491, 'Melyik sportban van „ütővel és labdával, négy bázissal”?', 'Baseball', 'Krikett', 'Tenisz', 'Golf', 5, 'Amerikai csapatsport', 2),
(492, 'Ki volt Muhammad Ali?', 'Bokszoló', 'Futballista', 'Kosárlabdázó', 'Teniszező', 5, 'Legendás ökölvívó', 3),
(493, 'Ki nyerte az első Tour de France-t?', 'Maurice Garin', 'Lemond', 'Coppi', 'Anquetil', 5, 'Kerékpár', 3),
(494, 'Melyik ország zászlaja piros-fehér-zöld?', 'Magyarország', 'Olaszország', 'Bulgária', 'Mexikó', 2, 'Nemzeti színek', 1),
(495, 'Mikor volt a Waterlooi csata?', '1815', '1805', '1799', '1821', 1, 'Napóleon végső veresége', 2),
(496, 'Ki volt az első Habsburg magyar király?', 'I. Ferdinánd', 'II. József', 'I. Lipót', 'III. Károly', 1, 'Mohács után', 3),
(497, 'Melyik ország fővárosa Lisszabon?', 'Portugália', 'Spanyolország', 'Olaszország', 'Görögország', 2, 'Ibériai-félsziget', 1),
(498, 'Hol található a Grand Canyon?', 'USA', 'Mexikó', 'Kanada', 'Brazília', 2, 'Arizona híres kanyonja', 2),
(499, 'Melyik sportban van touchdown?', 'Amerikai foci', 'Rögbi', 'Foci', 'Kézilabda', 5, 'Pontszerzés', 2),
(500, 'Ki volt az olimpiai úszólegenda Michael Phelps?', 'USA', 'Németország', 'Ausztrália', 'Franciaország', 5, 'Legtöbb aranyérmes', 3);

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
  MODIFY `kerdesek_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=501;

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
