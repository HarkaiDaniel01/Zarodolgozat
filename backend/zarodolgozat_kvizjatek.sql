-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 16. 08:55
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
-- Tábla szerkezet ehhez a táblához `eredmenyek`
--

CREATE TABLE `eredmenyek` (
  `Eredmenyek_id` int(11) NOT NULL,
  `Eredmenyek_pont` int(11) NOT NULL,
  `Eredmenyek_pontszam` int(11) NOT NULL DEFAULT 0,
  `Eredmenyek_jatekos` int(11) NOT NULL,
  `Eredmenyek_datum` datetime NOT NULL DEFAULT current_timestamp(),
  `Eredmenyek_kategoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;


-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jatekos`
--

CREATE TABLE `jatekos` (
  `jatekos_id` int(11) NOT NULL,
  `jatekos_nev` varchar(50) NOT NULL,
  `jatekos_jelszo` varchar(255) NOT NULL,
  `jatekos_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `jatekos`
--

INSERT INTO `jatekos` (`jatekos_id`, `jatekos_nev`, `jatekos_jelszo`, `jatekos_admin`) VALUES
(8, 'Admin', '$2b$10$H5QJ1pp3hKp73FkCo0FNT.oZArjGCCoSTBD/un/Fqn4SHOrZ53R.6', 1),
(14, 'Firefox_User', '$2b$10$UYCm2zuvEuyEK4oAHKpjp.3yeY90lsjIuoGf6l/u0wj6aHCnYHRYe', 0);

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
(1, 'Mikor volt a tatárjárás?', '1241', '1526', '1703', '1848', 1, 'A magyar történelem egyik sorsfordító eseménye.', 1),
(2, 'Ki volt az első magyar király?', 'Szent István', 'Károly Róbert', 'Hunyadi János', 'IV. Béla', 1, 'A keresztény magyar állam megalapítója.', 1),
(3, 'Melyik évben volt a mohácsi csata?', '1526', '1456', '1701', '1849', 1, 'A magyar történelem egyik legnagyobb veresége.', 1),
(4, 'Ki vezette a honfoglalást?', 'Árpád', 'Koppány', 'Géza', 'Szent István', 1, 'A magyar törzsek vezetője a honfoglalás idején.', 1),
(5, 'Melyik évben adták ki az amerikai függetlenségi nyilatkozatot?', '1776', '1789', '1804', '1755', 1, 'Az Egyesült Államok születésének dátuma.', 1),
(6, 'Ki volt a náci Németország vezetője?', 'Adolf Hitler', 'Joseph Stalin', 'Winston Churchill', 'Franklin D. Roosevelt', 1, 'A második világháború egyik fő alakja.', 1),
(7, 'Melyik évben omlott le a berlini fal?', '1989', '1991', '1975', '1961', 1, 'A hidegháború végét jelképező esemény.', 1),
(8, 'Melyik országban kezdődött a reformáció?', 'Németország', 'Franciaország', 'Olaszország', 'Anglia', 1, 'Luther Márton tevékenységéhez köthető.', 1),
(9, 'Ki volt a Római Birodalom első császára?', 'Augustus', 'Julius Caesar', 'Nero', 'Caligula', 1, 'A császári rendszer megalapítója.', 1),
(10, 'Melyik évben kezdődött az első világháború?', '1914', '1918', '1939', '1905', 1, 'A 20. század első nagy háborúja.', 1),
(11, 'Melyik évben ért véget a második világháború?', '1945', '1939', '1950', '1941', 1, 'A világháború lezárása.', 1),
(12, 'Ki volt a magyar szabadságharc vezetője 1848-ban?', 'Kossuth Lajos', 'Széchenyi István', 'Petőfi Sándor', 'Batthyány Lajos', 1, 'A forradalom politikai vezéralakja.', 1),
(13, 'Melyik évben volt a Rákóczi-szabadságharc kezdete?', '1703', '1848', '1526', '1606', 1, 'A Habsburgok elleni felkelés kezdete.', 1),
(14, 'Ki volt a náci propaganda minisztere?', 'Joseph Goebbels', 'Hermann Göring', 'Heinrich Himmler', 'Albert Speer', 1, 'A náci propaganda irányítója.', 1),
(15, 'Melyik évben lett Magyarország EU tag?', '2004', '1999', '2010', '1990', 1, 'Az európai integráció fontos lépése.', 1),
(16, 'Ki volt a Szovjetunió első vezetője?', 'Lenin', 'Stalin', 'Kruscsov', 'Gorbacsov', 1, 'A bolsevik forradalom vezéralakja.', 1),
(17, 'Melyik évben volt a párizsi béke?', '1947', '1919', '1955', '1939', 1, 'A második világháború utáni rendezés.', 1),
(18, 'Melyik országban volt a Bastille ostroma?', 'Franciaország', 'Németország', 'Olaszország', 'Anglia', 1, 'A francia forradalom kezdete.', 1),
(19, 'Melyik évben volt a 1956-os forradalom?', '1956', '1945', '1968', '1989', 1, 'A magyar népfelkelés éve.', 1),
(20, 'Ki volt a római hadvezér aki átlépte a Rubicont?', 'Julius Caesar', 'Nero', 'Augustus', 'Brutus', 1, 'A köztársaság bukásának előidézője.', 1),
(21, 'Melyik évben volt a Magna Carta kiadása?', '1215', '1066', '1492', '1302', 1, 'Az angol jog történetének mérföldköve.', 1),
(22, 'Ki volt a náci Németország hadseregének főparancsnoka?', 'Heinrich Himmler', 'Erwin Rommel', 'Adolf Hitler', 'Joseph Goebbels', 1, 'A Wehrmacht vezetője.', 1),
(23, 'Melyik évben kezdődött a hidegháború?', '1947', '1939', '1955', '1961', 1, 'A kétpólusú világ kialakulása.', 1),
(24, 'Melyik évben volt a müncheni egyezmény?', '1938', '1939', '1945', '1941', 1, 'A második világháború előzménye.', 1),
(25, 'Ki volt a Szovjetunió utolsó vezetője?', 'Gorbacsov', 'Stalin', 'Kruscsov', 'Lenin', 1, 'A Szovjetunió felbomlásának idején.', 1),
(26, 'Melyik évben volt a normann hódítás Angliában?', '1066', '1215', '1492', '1302', 1, 'Az angol történelem fordulópontja.', 1),
(27, 'Melyik évben fedezte fel Kolumbusz Amerikát?', '1492', '1526', '1607', '1776', 1, 'A felfedezések kora kezdete.', 1),
(28, 'Melyik évben volt a berlini fal építése?', '1961', '1989', '1955', '1947', 1, 'A kelet-nyugati megosztottság szimbóluma.', 1),
(29, 'Ki volt a náci Németország légierő vezetője?', 'Hermann Göring', 'Joseph Goebbels', 'Heinrich Himmler', 'Albert Speer', 1, 'A Luftwaffe parancsnoka.', 1),
(30, 'Melyik évben volt a versailles-i békeszerződés?', '1919', '1945', '1938', '1923', 1, 'Az első világháború lezárása.', 1),
(31, 'Melyik évben volt a bécsi kongresszus?', '1815', '1848', '1789', '1914', 1, 'A napóleoni háborúk utáni rendezés.', 2),
(32, 'Ki volt a Habsburg-ház első magyar királya?', 'I. Ferdinánd', 'II. Lajos', 'IV. Béla', 'Szent István', 1, 'A Habsburg uralom kezdete Magyarországon.', 2),
(33, 'Melyik évben volt a trianoni békeszerződés?', '1920', '1919', '1945', '1938', 1, 'Magyarország területi veszteségeinek éve.', 2),
(34, 'Ki volt a magyar király az Anjou-házból?', 'Károly Róbert', 'Szent István', 'Hunyadi Mátyás', 'II. Lajos', 1, 'A gazdasági reformok királya.', 2),
(35, 'Melyik évben volt a berlini konferencia Afrika felosztásáról?', '1884', '1914', '1848', '1905', 1, 'A gyarmatosítás fontos állomása.', 2),
(36, 'Ki volt a francia forradalom radikális vezetője?', 'Robespierre', 'Napóleon', 'Danton', 'Marat', 1, 'A jakobinus diktatúra vezéralakja.', 2),
(37, 'Melyik évben volt a nagy októberi szocialista forradalom?', '1917', '1905', '1922', '1939', 1, 'A bolsevik hatalomátvétel éve.', 2),
(38, 'Ki volt a magyar király aki megalapította az egyetemet Pécsen?', 'Nagy Lajos', 'Szent István', 'Károly Róbert', 'Hunyadi Mátyás', 1, 'A magyar oktatás történetének mérföldköve.', 2),
(39, 'Melyik évben volt a Magna Carta kiadása?', '1215', '1066', '1492', '1302', 1, 'Az angol jog történetének mérföldköve.', 2),
(40, 'Melyik évben volt a reformáció kezdete?', '1517', '1492', '1618', '1302', 1, 'Luther Márton fellépésének éve.', 2),
(41, 'Ki volt a náci Németország hadseregének főparancsnoka?', 'Heinrich Himmler', 'Erwin Rommel', 'Adolf Hitler', 'Joseph Goebbels', 1, 'A Wehrmacht vezetője.', 2),
(42, 'Melyik évben volt a müncheni egyezmény?', '1938', '1939', '1945', '1941', 1, 'A második világháború előzménye.', 2),
(43, 'Ki volt a Szovjetunió utolsó vezetője?', 'Gorbacsov', 'Stalin', 'Kruscsov', 'Lenin', 1, 'A Szovjetunió felbomlásának idején.', 2),
(44, 'Melyik évben volt a normann hódítás Angliában?', '1066', '1215', '1492', '1302', 1, 'Az angol történelem fordulópontja.', 2),
(45, 'Melyik évben fedezte fel Kolumbusz Amerikát?', '1492', '1526', '1607', '1776', 1, 'A felfedezések kora kezdete.', 2),
(46, 'Melyik évben volt a berlini fal építése?', '1961', '1989', '1955', '1947', 1, 'A kelet-nyugati megosztottság szimbóluma.', 2),
(47, 'Ki volt a náci Németország légierő vezetője?', 'Hermann Göring', 'Joseph Goebbels', 'Heinrich Himmler', 'Albert Speer', 1, 'A Luftwaffe parancsnoka.', 2),
(48, 'Melyik évben volt a versailles-i békeszerződés?', '1919', '1945', '1938', '1923', 1, 'Az első világháború lezárása.', 2),
(49, 'Melyik évben volt a canossa-járás?', '1077', '1215', '800', '962', 1, 'A pápaság és császárság konfliktusának szimbóluma.', 2),
(50, 'Melyik évben volt a wormsi konkordátum?', '1122', '1077', '1215', '1302', 1, 'A pápaság és császárság közötti megegyezés.', 2),
(51, 'Melyik évben volt a rigómezei csata?', '1389', '1453', '1526', '1302', 1, 'A török terjeszkedés fontos állomása.', 2),
(52, 'Melyik évben volt a bécsi ostrom a törökök által?', '1683', '1526', '1606', '1711', 1, 'A Habsburg-török háborúk fordulópontja.', 2),
(53, 'Melyik évben volt a harmincéves háború kezdete?', '1618', '1648', '1606', '1588', 1, 'Európa egyik leghosszabb háborúja.', 2),
(54, 'Melyik béke zárta le a harmincéves háborút?', 'Vesztfáliai béke', 'Utrechti béke', 'Trianoni béke', 'Bécsi béke', 1, 'A vallási háborúk lezárása.', 2),
(55, 'Melyik évben volt a Szent Szövetség megalakulása?', '1815', '1792', '1848', '1871', 1, 'A napóleoni háborúk utáni rend fenntartása.', 2),
(56, 'Melyik évben volt a Tanácsköztársaság?', '1919', '1918', '1920', '1945', 1, 'A kommunista hatalomátvétel rövid időszaka.', 2),
(57, 'Melyik évben volt a második bécsi döntés?', '1940', '1938', '1941', '1939', 1, 'Magyarország területi visszacsatolása.', 2),
(58, 'Melyik évben volt a doni katasztrófa?', '1943', '1941', '1944', '1942', 1, 'A magyar hadsereg súlyos vesztesége.', 2),
(59, 'Melyik évben volt a párizsi békeszerződés?', '1947', '1945', '1956', '1939', 1, 'A második világháború utáni rendezés.', 2),
(60, 'Melyik évben volt a nikáfelkelés?', '532', '476', '622', '800', 1, 'A bizánci történelem egyik legnagyobb lázadása.', 3),
(61, 'Ki volt a bizánci császár a nikáfelkelés idején?', 'I. Justinianus', 'I. Constantinus', 'II. Theodosius', 'Herakleiosz', 1, 'A bizánci birodalom jelentős uralkodója.', 3),
(62, 'Melyik évben volt a canossa-járás?', '1077', '1215', '800', '962', 1, 'A pápaság és császárság konfliktusának szimbóluma.', 3),
(63, 'Ki volt az első Habsburg császár?', 'I. Rudolf', 'II. Ferdinánd', 'III. Károly', 'I. Miksa', 1, 'A Habsburg-dinasztia alapítója.', 3),
(64, 'Melyik évben volt a wormsi konkordátum?', '1122', '1077', '1215', '1302', 1, 'A pápaság és császárság közötti megegyezés.', 3),
(65, 'Melyik évben volt a rigómezei csata?', '1389', '1453', '1526', '1302', 1, 'A török terjeszkedés fontos állomása.', 3),
(66, 'Ki volt a magyar király a rigómezei csata idején?', 'Zsigmond király', 'Nagy Lajos', 'Károly Róbert', 'II. Ulászló', 1, 'A Luxemburg-ház uralkodója.', 3),
(67, 'Melyik évben volt a bécsi ostrom a törökök által?', '1683', '1526', '1606', '1711', 1, 'A Habsburg-török háborúk fordulópontja.', 3),
(68, 'Ki vezette a török sereget a bécsi ostromnál?', 'Kara Musztafa', 'Szulejmán szultán', 'Mehmed', 'Selim', 1, 'A török hadvezetés kulcsfigurája.', 3),
(69, 'Melyik évben volt a harmincéves háború kezdete?', '1618', '1648', '1606', '1588', 1, 'Európa egyik leghosszabb háborúja.', 3),
(70, 'Melyik béke zárta le a harmincéves háborút?', 'Vesztfáliai béke', 'Utrechti béke', 'Trianoni béke', 'Bécsi béke', 1, 'A vallási háborúk lezárása.', 3),
(71, 'Melyik évben volt a Szent Szövetség megalakulása?', '1815', '1792', '1848', '1871', 1, 'A napóleoni háborúk utáni rend fenntartása.', 3),
(72, 'Ki volt a magyar miniszterelnök 1848-ban?', 'Batthyány Lajos', 'Kossuth Lajos', 'Széchenyi István', 'Deák Ferenc', 1, 'Az első felelős magyar kormány vezetője.', 3),
(73, 'Melyik évben volt a kiegyezés?', '1867', '1848', '1871', '1850', 1, 'A Habsburg-magyar viszony rendezése.', 3),
(74, 'Ki volt Ferenc József felesége?', 'Erzsébet királyné', 'Mária Terézia', 'Zita királyné', 'Anna királyné', 1, 'A magyarok által kedvelt uralkodóné.', 3),
(75, 'Melyik évben volt az első magyar népköztársaság?', '1918', '1946', '1920', '1919', 1, 'Az Osztrák–Magyar Monarchia bukása után.', 3),
(76, 'Ki volt az első magyar köztársasági elnök?', 'Károlyi Mihály', 'Horthy Miklós', 'Bibó István', 'Nagy Imre', 1, 'A Tanácsköztársaság előtti vezető.', 3),
(77, 'Melyik évben volt a Tanácsköztársaság?', '1919', '1918', '1920', '1945', 1, 'A kommunista hatalomátvétel rövid időszaka.', 3),
(78, 'Ki vezette a Tanácsköztársaságot?', 'Kun Béla', 'Károlyi Mihály', 'Rákosi Mátyás', 'Nagy Imre', 1, 'A kommunista vezetés alakja.', 3),
(79, 'Melyik évben volt a második bécsi döntés?', '1940', '1938', '1941', '1939', 1, 'Magyarország területi visszacsatolása.', 3),
(80, 'Melyik évben volt a doni katasztrófa?', '1943', '1941', '1944', '1942', 1, 'A magyar hadsereg súlyos vesztesége.', 3),
(81, 'Ki volt a magyar miniszterelnök a doni katasztrófa idején?', 'Kállay Miklós', 'Teleki Pál', 'Bárdossy László', 'Nagy Ferenc', 1, 'A háborús időszak politikai vezetője.', 3),
(82, 'Melyik évben volt a párizsi békeszerződés?', '1947', '1945', '1956', '1939', 1, 'A második világháború utáni rendezés.', 3),
(83, 'Melyik évben volt a magyar forradalom leverése?', '1956', '1945', '1968', '1989', 1, 'A szovjet beavatkozás éve.', 3),
(84, 'Ki volt a szovjet vezető 1956-ban?', 'Hruscsov', 'Sztálin', 'Gorbacsov', 'Lenin', 1, 'A magyar forradalom leverésének irányítója.', 3),
(85, 'Melyik évben volt a rendszerváltás Magyarországon?', '1989', '1990', '1985', '1991', 1, 'A kommunista rendszer bukása.', 3),
(86, 'Ki volt az első szabadon választott magyar miniszterelnök?', 'Antall József', 'Horn Gyula', 'Orbán Viktor', 'Németh Miklós', 1, 'A demokratikus átmenet vezetője.', 3),
(87, 'Melyik évben csatlakozott Magyarország a NATO-hoz?', '1999', '2004', '1990', '1989', 1, 'A nyugati katonai szövetséghez való csatlakozás.', 3),
(88, 'Melyik évben volt a berlini konferencia?', '1884', '1905', '1848', '1914', 1, 'A gyarmati területek felosztása Afrikában.', 3),
(89, 'Melyik évben volt a spanyol polgárháború kezdete?', '1936', '1939', '1945', '1922', 1, 'A fasizmus és kommunizmus harca.', 3),
(90, 'Ki volt a spanyol polgárháború fasiszta vezetője?', 'Franco tábornok', 'Mussolini', 'Hitler', 'Salazar', 1, 'A diktatúra megalapítója Spanyolországban.', 3),
(91, 'Melyik évben volt a müncheni egyezmény?', '1938', '1939', '1945', '1941', 1, 'A Szudéta-vidék átadása Németországnak.', 3),
(92, 'Melyik évben volt a Pearl Harbor elleni támadás?', '1941', '1939', '1945', '1942', 1, 'Az USA belépése a világháborúba.', 3),
(93, 'Melyik évben volt a normandiai partraszállás?', '1944', '1941', '1945', '1943', 1, 'A nyugati front megnyitása.', 3),
(94, 'Melyik évben volt a potsdami konferencia?', '1945', '1943', '1944', '1946', 1, 'A háború utáni rendezés.', 3),
(95, 'Melyik évben volt a vasfüggöny lebontása?', '1989', '1991', '1985', '1990', 1, 'A kelet-nyugati megosztottság vége.', 3),
(96, 'Melyik évben volt a Maastrichti szerződés?', '1992', '2004', '1999', '1989', 1, 'Az Európai Unió alapító dokumentuma.', 3),
(97, 'Melyik évben volt a 9/11 terrortámadás?', '2001', '1999', '2004', '1995', 1, 'A modern történelem egyik fordulópontja.', 3),
(98, 'Melyik évben volt az arab tavasz kezdete?', '2010', '2001', '2005', '2015', 1, 'A közel-keleti forradalmi hullám kezdete.', 3),
(99, 'Melyik évben volt a Brexit népszavazás?', '2016', '2019', '2012', '2008', 1, 'Nagy-Britannia EU-ból való kilépéséről döntöt', 3),
(100, 'Melyik évben volt a COVID-19 világjárvány kezdete?', '2019', '2020', '2018', '2021', 1, 'A globális egészségügyi válság kezdete.', 3),
(101, 'Melyik ország fővárosa Párizs?', 'Franciaország', 'Olaszország', 'Spanyolország', 'Németország', 2, 'Európa egyik legismertebb városa.', 1),
(102, 'Melyik kontinensen található Egyiptom?', 'Afrika', 'Ázsia', 'Európa', 'Dél-Amerika', 2, 'A piramisok hazája.', 1),
(103, 'Melyik országban található a Niagara-vízesés?', 'USA', 'Kanada', 'Mexikó', 'Brazília', 2, 'Észak-Amerika híres vízesése.', 1),
(104, 'Melyik a Föld legnagyobb sivataga?', 'Antarktisz', 'Szahara', 'Góbi', 'Kalahári', 2, 'Hideg sivatag nem homokos.', 1),
(105, 'Melyik ország fővárosa Róma?', 'Olaszország', 'Franciaország', 'Spanyolország', 'Görögország', 2, 'A római birodalom központja.', 1),
(106, 'Melyik országban található a Fuji-hegy?', 'Japán', 'Kína', 'Dél-Korea', 'Thaiföld', 2, 'A szigetország ikonikus vulkánja.', 1),
(107, 'Melyik ország fővárosa Berlin?', 'Németország', 'Ausztria', 'Svájc', 'Hollandia', 2, 'Közép-Európa egyik nagyhatalma.', 1),
(108, 'Melyik kontinensen található Brazília?', 'Dél-Amerika', 'Észak-Amerika', 'Afrika', 'Ázsia', 2, 'A karneválok és az Amazonas hazája.', 1),
(109, 'Melyik ország fővárosa London?', 'Egyesült Királyság', 'Írország', 'Ausztrália', 'Kanada', 2, 'A Big Ben otthona.', 1),
(110, 'Melyik országban található a Kilimandzsáró?', 'Tanzánia', 'Kenya', 'Nigéria', 'Egyiptom', 2, 'Afrika legmagasabb hegye.', 1),
(111, 'Melyik ország fővárosa Madrid?', 'Spanyolország', 'Portugália', 'Olaszország', 'Franciaország', 2, 'Ibériai-félsziget központja.', 1),
(112, 'Melyik országban található a Grand Canyon?', 'USA', 'Kanada', 'Mexikó', 'Brazília', 2, 'Az egyik legismertebb szurdok.', 1),
(113, 'Melyik ország fővárosa Athén?', 'Görögország', 'Olaszország', 'Törökország', 'Bulgária', 2, 'Az ókori demokrácia bölcsője.', 1),
(114, 'Melyik országban található a Taj Mahal?', 'India', 'Pakisztán', 'Banglades', 'Nepál', 2, 'Az egyik legismertebb mauzóleum.', 1),
(115, 'Melyik ország fővárosa Bécs?', 'Ausztria', 'Németország', 'Svájc', 'Csehország', 2, 'A klasszikus zene városa.', 1),
(116, 'Melyik országban található a Szajna folyó?', 'Franciaország', 'Németország', 'Olaszország', 'Spanyolország', 2, 'Párizson keresztül folyik.', 1),
(117, 'Melyik ország fővárosa Budapest?', 'Magyarország', 'Ausztria', 'Románia', 'Szlovákia', 2, 'A Duna két partján fekvő város.', 1),
(118, 'Melyik országban található a Gízai piramis?', 'Egyiptom', 'Irak', 'Irán', 'Marokkó', 2, 'Az ókori világ csodája.', 1),
(119, 'Melyik ország fővárosa Oslo?', 'Norvégia', ' Svédország', ' Finnország', ' Dánia', 2, 'Skandináv ország fővárosa.', 1),
(120, 'Melyik országban található a Machu Picchu?', 'Peru', 'Brazília', 'Chile', 'Argentína', 2, 'Az inka civilizáció emléke.', 1),
(121, 'Melyik ország fővárosa Canberra?', 'Ausztrália', 'Új-Zéland', 'USA', 'Kanada', 2, 'Nem Sydney!', 1),
(122, 'Melyik országban található a Viktória-vízesés?', 'Zimbabwe', 'Namíbia', 'Kenya', 'Dél-Afrika', 2, 'Afrika egyik legnagyobb vízesése.', 1),
(123, 'Melyik ország fővárosa Ottawa?', 'Kanada', 'USA', 'Mexikó', 'Ausztrália', 2, 'Észak-Amerika északi részén.', 1),
(124, 'Melyik országban található a Gangesz folyó?', 'India', 'Kína', 'Nepál', 'Észak-Korea', 2, 'Szent folyó.', 1),
(125, 'Melyik ország fővárosa Peking?', 'Kína', ' Japán', ' Dél-Korea', ' Thaiföld', 2, 'Ázsia egyik legnagyobb városa.', 1),
(126, 'Melyik országban található a Duna forrása?', 'Németország', 'Ausztria', 'Svájc', 'Franciaország', 2, 'A Fekete-erdőből ered.', 1),
(127, 'Melyik ország fővárosa Varsó?', 'Lengyelország', 'Csehország', 'Magyarország', 'Románia', 2, 'Közép-Európa fontos városa.', 1),
(128, 'Melyik országban található a Kék Nílus forrása?', 'Etiópia', 'Egyiptom', 'Szudán', 'Uganda', 2, 'A Nílus egyik ága.', 1),
(129, 'Melyik ország fővárosa Stockholm?', 'Svédország', 'Norvégia', 'Finnország', 'Dánia', 2, 'Skandináv ország központja.', 1),
(130, 'Melyik városban található az Eiffel-torony?', 'Párizs', 'Lyon', 'Marseille', 'Nice', 2, 'Franciaország ikonikus építménye.', 2),
(131, 'Melyik városban található a Colosseum?', 'Róma', 'Milánó', 'Nápoly', 'Velence', 2, 'Az ókori gladiátorharcok helyszíne.', 2),
(132, 'Melyik városban található a Sagrada Família?', 'Barcelona', 'Madrid', 'Valencia', 'Sevilla', 2, 'Gaudí híres temploma.', 2),
(133, 'Melyik városban található a Brandenburgi kapu?', 'Berlin', 'München', 'Hamburg', 'Drezda', 2, 'Németország történelmi szimbóluma.', 2),
(134, 'Melyik városban található a Big Ben?', 'London', 'Manchester', 'Liverpool', 'Oxford', 2, 'A brit parlament óratornya.', 2),
(135, 'Melyik városban található a Sydney-i Operaház?', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 2, 'Ausztrália ikonikus épülete.', 2),
(136, 'Melyik városban található a Kreml?', 'Moszkva', 'Szentpétervár', 'Kijev', 'Minszk', 2, 'Oroszország politikai központja.', 2),
(137, 'Melyik városban található a Taj Mahal?', 'Agra', 'Delhi', 'Mumbai', 'Jaipur', 2, 'India híres mauzóleuma.', 2),
(138, 'Melyik városban található a Burj Khalifa?', 'Dubai', 'Abu Dhabi', 'Doha', 'Riyadh', 2, 'A világ legmagasabb épülete.', 2),
(139, 'Melyik városban található a CN Tower?', 'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 2, 'Kanada híres tornya.', 2),
(140, 'Melyik városban található a Petronas ikertorony?', 'Kuala Lumpur', 'Szingapúr', 'Bangkok', 'Jakarta', 2, 'Malajzia modern építészeti csodája.', 2),
(141, 'Melyik városban található a Golden Gate híd?', 'San Francisco', 'Los Angeles', 'Seattle', 'San Diego', 2, 'Kalifornia ikonikus hídja.', 2),
(142, 'Melyik városban található a Machu Picchu?', 'Cusco', 'Lima', 'Arequipa', 'Trujillo', 2, 'Az inka romváros közelében.', 2),
(143, 'Melyik városban található a Szfinx?', 'Gíza', 'Kairó', 'Alexandria', 'Luxor', 2, 'Egyiptom ősi szobra.', 2),
(144, 'Melyik városban található a Parlament épülete Magyarországon?', 'Budapest', 'Szeged', 'Debrecen', 'Pécs', 2, 'A Duna partján álló épület.', 2),
(145, 'Melyik városban található az Akropolisz?', 'Athén', 'Thesszaloniki', 'Spárta', 'Patrasz', 2, 'Görögország ókori emléke.', 2),
(146, 'Melyik városban található a Szabadság-szobor?', 'New York', 'Washington', 'Boston', 'Chicago', 2, 'Az amerikai szabadság jelképe.', 2),
(147, 'Melyik városban található a Louvre?', 'Párizs', 'Lyon', 'Marseille', 'Nice', 2, 'A Mona Lisa otthona.', 2),
(148, 'Melyik városban található a Pisa-i ferde torony?', 'Pisa', 'Róma', 'Firenze', 'Nápoly', 2, 'Olaszország híres építménye.', 2),
(149, 'Melyik városban található a Stonehenge közelében?', 'Salisbury', 'Bristol', 'Oxford', 'Leeds', 2, 'Ősi kőkör Angliában.', 2),
(150, 'Melyik városban található a Reichstag?', 'Berlin', 'Hamburg', 'München', 'Frankfurt', 2, 'Német parlament épülete.', 2),
(151, 'Melyik városban található a Székesfehérvári bazilika?', 'Székesfehérvár', 'Veszprém', 'Esztergom', 'Pécs', 2, 'Magyar királyok koronázóhelye.', 2),
(152, 'Melyik városban található a Notre-Dame?', 'Párizs', 'Lyon', 'Marseille', 'Nice', 2, 'Gótikus katedrális Franciaországban.', 2),
(153, 'Melyik városban található a Hagia Sophia?', 'Isztambul', 'Ankara', 'Izmir', 'Bursa', 2, 'Törökország híres vallási épülete.', 2),
(154, 'Melyik városban található a Vatikán?', 'Róma', 'Nápoly', 'Firenze', 'Milánó', 2, 'A katolikus egyház központja.', 2),
(155, 'Melyik városban található a Empire State Building?', 'New York', 'Chicago', 'Los Angeles', 'Miami', 2, 'Az amerikai felhőkarcolók szimbóluma.', 2),
(156, 'Melyik városban található a Széchenyi fürdő?', 'Budapest', 'Eger', 'Hévíz', 'Miskolc', 2, 'Európa egyik legnagyobb fürdőkomplexuma.', 2),
(157, 'Melyik városban található a Neuschwanstein kastély?', 'Schwangau', 'München', 'Nürnberg', 'Stuttgart', 2, 'A Disney-kastély ihletője.', 2),
(158, 'Melyik városban található a Capitolium?', 'Washington', 'New York', 'Boston', 'Philadelphia', 2, 'Az amerikai törvényhozás épülete.', 2),
(159, 'Melyik városban található a Szépművészeti Múzeum?', 'Budapest', 'Pécs', 'Szeged', 'Debrecen', 2, 'Magyarország egyik legnagyobb művészeti gyűjteménye.', 2),
(160, 'Melyik országban található az Angkor Wat?', 'Kambodzsa', 'Thaiföld', 'Vietnam', 'Laosz', 2, 'A világ legnagyobb vallási komplexuma.', 3),
(161, 'Melyik hegységben található a Matterhorn?', 'Alpok', 'Kárpátok', 'Andok', 'Atlasz', 2, 'Ikonikus csúcs Svájc és Olaszország határán.', 3),
(162, 'Melyik szigetcsoporthoz tartozik Bora Bora?', 'Francia Polinézia', 'Maldív-szigetek', 'Hawaii', 'Bahama-szigetek', 2, 'Csendes-óceáni paradicsom.', 3),
(163, 'Melyik országban található a Salar de Uyuni?', 'Bolívia', 'Peru', 'Chile', 'Argentína', 2, 'A világ legnagyobb sómezője.', 3),
(164, 'Melyik országban található a Pamír-fennsík?', 'Tádzsikisztán', 'Kazahsztán', 'Kína', 'Afganisztán', 2, 'Magashegységi fennsík Közép-Ázsiában.', 3),
(165, 'Melyik országban található a Socotra-sziget?', 'Jemen', 'Oman', 'India', 'Etiópia', 2, 'Különleges növényvilágáról híres.', 3),
(166, 'Melyik országban található a Bungle Bungle Range?', 'Ausztrália', 'USA', 'Chile', 'Dél-Afrika', 2, 'Különleges homokkő formációk.', 3),
(167, 'Melyik országban található a Zhangjiajie Nemzeti Park?', 'Kína', 'Thaiföld', 'Vietnam', 'Malajzia', 2, 'A lebegő sziklák Avatar film ihletője.', 3),
(168, 'Melyik országban található a Lençóis Maranhenses Nemzeti Park?', 'Brazília', 'Peru', 'Kolumbia', 'Argentína', 2, 'Hófehér homokdűnék és lagúnák.', 3),
(169, 'Melyik országban található a Plitvicei-tavak?', 'Horvátország', 'Szlovénia', 'Montenegró', 'Szerbia', 2, 'Karsztos vízesések és tavak.', 3),
(170, 'Melyik országban található a Trolltunga?', 'Norvégia', 'Izland', 'Svédország', 'Finnország', 2, 'Látványos sziklaképződmény.', 3),
(171, 'Melyik országban található a Giant’s Causeway?', 'Egyesült Királyság', 'Írország', 'Németország', 'Dánia', 2, 'Bazaltoszlopok Észak-Írországban.', 3),
(172, 'Melyik hegységben található a Roraima-hegy?', 'Venezuelai-hegység', 'Brazíliai-fennsík', 'Andok', 'Patagóniai-hegység', 2, 'Lapított csúcsú hegy Dél-Amerikában.', 3),
(173, 'Melyik országban található a Deadvlei?', 'Namíbia', 'Botswana', 'Dél-Afrika', 'Zimbabwe', 2, 'Kiszáradt agyagmedence a sivatagban.', 3),
(174, 'Melyik országban található a Lake Natron?', 'Tanzánia', 'Kenya', 'Uganda', 'Ruanda', 2, 'Vörös színű sós tó.', 3),
(175, 'Melyik országban található a Aogashima vulkáni sziget?', 'Japán', 'Indonézia', 'Fülöp-szigetek', 'Tajvan', 2, 'Elzárt sziget Tokió közelében.', 3),
(176, 'Melyik országban található a Mount Erebus?', 'Antarktisz', 'Ausztrália', 'Új-Zéland', 'Chile', 2, 'A kontinens legaktívabb vulkánja.', 3),
(177, 'Melyik országban található a Lake Baikal?', 'Oroszország', 'Kazahsztán', 'Mongólia', 'Kína', 2, 'A világ legmélyebb tava.', 3),
(178, 'Melyik országban található a Valley of the Kings?', 'Egyiptom', 'Irak', 'Irán', 'Marokkó', 2, 'Fáraók sírhelyei Luxor közelében.', 3),
(179, 'Melyik országban található a Vinicunca (Szivárvány-hegy)?', 'Peru', 'Bolívia', 'Chile', 'Argentína', 2, 'Természetes színes hegy.', 3),
(180, 'Melyik hegységben található a Fitz Roy-hegy?', 'Andok', 'Alpok', 'Kordillerák', 'Atlasz', 2, 'Patagónia ikonikus csúcsa.', 3),
(181, 'Melyik hegységben található az Elbrusz?', 'Kaukázus', 'Urál', 'Alpok', 'Kárpátok', 2, 'Európa legmagasabb hegye.', 3),
(182, 'Melyik országban található a White Desert?', 'Egyiptom', 'Marokkó', 'Algéria', 'Irán', 2, 'Különleges krétás sziklaformák.', 3),
(183, 'Melyik országban található a Cook-hegy?', 'Új-Zéland', 'Ausztrália', 'Fidzsi-szigetek', 'Papua Új-Guinea', 2, 'Az ország legmagasabb csúcsa.', 3),
(184, 'Melyik országban található a Torres del Paine?', 'Chile', 'Argentína', 'Bolívia', 'Peru', 2, 'Gránittornyok Patagóniában.', 3),
(185, 'Melyik hegységben található a Kinabalu-hegy?', 'Borneói-hegység', 'Maláj-fennsík', 'Indokínai-hegység', 'Szumátrai-hegység', 2, 'Borneo legmagasabb hegye.', 3),
(186, 'Melyik országban található a Hillier tó?', 'Ausztrália', 'Új-Zéland', 'Chile', 'USA', 2, 'Rózsaszín színű tó.', 3),
(187, 'Melyik országban található a Pamukkale?', 'Törökország', 'Iráni', 'Szíria', 'Görögország', 2, 'Természetes mészkőteraszok.', 3),
(188, 'Melyik hegységben található a Damavand-hegy?', 'Elburz-hegység', 'Zagrosz', 'Kaukázus', 'Ararát', 2, 'Iráni vulkán.', 3),
(189, 'Melyik hegységben található a Nyiragongo-hegy?', 'Virunga-hegység', 'Rwenzori', 'Kilimandzsáró', 'Kordillerák', 2, 'A világ egyik legaktívabb lávatava.', 3),
(190, 'Melyik hegységben található a Bromo-hegy?', 'Tengger-hegység', 'Maláj-fennsík', 'Szumátrai-hegység', 'Indokínai-hegység', 2, 'Turisták által látogatott vulkán.', 3),
(191, 'Melyik hegységben található a Toubkal-hegy?', 'Atlasz', 'Kaukázus', 'Elburz', 'Kordillerák', 2, 'Észak-Afrika legmagasabb hegye.', 3),
(192, 'Melyik hegységben található a Kosciuszko-hegy?', 'Ausztrál-Alpok', 'Tasmán-hegység', 'Új-Zélandi-hegység', 'Borneói-hegység', 2, 'Ausztrália legmagasabb pontja.', 3),
(193, 'Melyik hegységben található az Ararát-hegy?', 'Török-hegység', 'Kaukázus', 'Zagrosz', 'Elburz', 2, 'A bibliai Noé bárkája legendája.', 3),
(194, 'Melyik hegységben található az Olümposz?', 'Olimposzi-hegység', 'Kaukázus', 'Kárpátok', 'Alpok', 2, 'A görög mitológia isteneinek otthona.', 3),
(195, 'Melyik hegységben található a Fuji-hegy?', 'Japán-hegység', 'Kínai-fennsík', 'Kordillerák', 'Szumátrai-hegység', 2, 'Ikonikus vulkán Tokió közelében.', 3),
(196, 'Melyik hegységben található a Tábla-hegy?', 'Fokföldi-hegység', 'Atlasz', 'Kalahári-fennsík', 'Drakensberg', 2, 'Lapos tetejű hegy Dél-Afrikában.', 3),
(197, 'Melyik hegységben található a Kenya-hegy?', 'Kenya-hegység', 'Kilimandzsáró', 'Rwenzori', 'Virunga', 2, 'Afrika második legmagasabb hegye.', 3),
(198, 'Melyik hegységben található a Sínai-hegy?', 'Sínai-hegység', 'Negev-fennsík', 'Ararát', 'Kaukázus', 2, 'Bibliai jelentőségű hegy.', 3),
(199, 'Melyik hegységben található az Etna?', 'Szicíliai-hegység', 'Alpok', 'Kaukázus', 'Appenninek', 2, 'Európa legaktívabb vulkánja.', 3),
(200, 'Ki írta az „Anyám tyúkja” című verset?', 'Petőfi Sándor', 'Arany János', 'Ady Endre', 'József Attila', 3, 'Magyar klasszikus humoros költemény.', 1),
(201, 'Melyik műfajba tartozik a regény?', 'epikus próza', 'dráma', 'ballada', 'vers', 3, 'Hosszabb prózai elbeszélés.', 1),
(202, 'Melyik korszakhoz köthető a reneszánsz?', 'humanizmus', 'barokk', 'romantika', 'realizmus', 3, 'Újjászületés a klasszikus értékekben.', 1),
(203, 'Melyik műfaj jellemzője a párbeszéd?', 'dráma', 'regény', 'eposz', 'ballada', 3, 'Előadásra szánt irodalmi forma.', 1),
(204, 'Melyik stílusirányzat jellemzője a természetközpontúság?', 'romantika', 'klasszicizmus', 'barokk', 'szimbolizmus', 3, '19. századi érzelmi irányzat.', 1),
(205, 'Melyik korszakban alkotott Petőfi Sándor?', '19. század', '18. század', '20. század', '17. század', 3, 'Magyar romantika vezéralakja.', 1),
(206, 'Melyik műfaj jellemzője a tanító célzat?', 'mese', 'regény', 'dráma', 'ballada', 3, 'Didaktikus irodalom.', 1),
(207, 'Melyik stílusirányzat jellemzője a szabadságvágy?', 'romantika', 'klasszicizmus', 'barokk', 'realizmus', 3, 'Érzelmek és egyéni szabadság hangsúlya.', 1),
(208, 'Melyik korszakban alkotott Arany János?', '19. század', '18. század', '20. század', '17. század', 3, 'Magyar balladaköltészet mestere.', 1),
(209, 'Melyik műfaj jellemzője a rövid csattanós történet?', 'novella', 'regény', 'dráma', 'eposz', 3, 'Tömör prózai mű.', 1),
(210, 'Melyik stílusirányzat jellemzője a vallásos pátosz?', 'barokk', 'klasszicizmus', 'realizmus', 'romantika', 3, '17. századi művészet.', 1),
(211, 'Melyik korszakban alkotott József Attila?', '20. század', '19. század', '18. század', '21. század', 3, 'Modern magyar költő.', 1),
(212, 'Melyik műfaj jellemzője a hősi téma?', 'eposz', 'regény', 'dráma', 'ballada', 3, 'Homérosz műveinek műfaja.', 1),
(213, 'Melyik stílusirányzat jellemzője a szimbólumok használata?', 'szimbolizmus', 'klasszicizmus', 'realizmus', 'barokk', 3, '19. századi költői irányzat.', 1),
(214, 'Melyik korszakban alkotott Radnóti Miklós?', '20. század', '19. század', '18. század', '21. század', 3, 'Holokauszt-költészet.', 1),
(215, 'Melyik műfaj jellemzője a színpadi előadás?', 'dráma', 'regény', 'eposz', 'ballada', 3, 'Előadásra szánt irodalom.', 1),
(216, 'Melyik stílusirányzat jellemzője a túlzó érzelem?', 'barokk', 'klasszicizmus', 'szimbolizmus', 'realizmus', 3, '17. századi művészeti irányzat.', 1),
(217, 'Melyik korszakban alkotott Móricz Zsigmond?', '20. század', '19. század', '18. század', '21. század', 3, 'Paraszti világ ábrázolója.', 1),
(218, 'Melyik műfaj jellemzője a belső monológ?', 'regény', 'dráma', 'eposz', 'ballada', 3, 'Modern prózai technika.', 1),
(219, 'Melyik stílusirányzat jellemzője a szabályosság?', 'klasszicizmus', 'barokk', 'romantika', 'szimbolizmus', 3, '18. századi esztétikai elv.', 1),
(220, 'Melyik korszakban alkotott Kosztolányi Dezső?', '20. század', '19. század', '18. század', '21. század', 3, 'Nyugat első nemzedéke.', 1),
(221, 'Melyik műfaj jellemzője a tanmese?', 'példázat', 'regény', 'dráma', 'ballada', 3, 'Erkölcsi tanulságot hordozó történet.', 1),
(222, 'Melyik stílusirányzat jellemzője a társadalomkritika?', 'realizmus', 'klasszicizmus', 'barokk', 'szimbolizmus', 3, 'Valósághű ábrázolás.', 1),
(223, 'Melyik korszakban alkotott Ady Endre?', '20. század', '19. század', '18. század', '21. század', 3, 'Modern magyar költészet úttörője.', 1),
(224, 'Melyik műfaj jellemzője a tragikus hős?', 'tragédia', 'komédia', 'regény', 'ballada', 3, 'Drámai műfaj.', 1),
(225, 'Melyik stílusirányzat jellemzője a groteszk?', 'avantgárd', 'klasszicizmus', 'romantika', 'realizmus', 3, '20. századi kísérleti irodalom.', 1),
(226, 'Melyik korszakban alkotott Babits Mihály?', '20. század', '19. század', '18. század', '21. század', 3, 'Nyugat második nemzedéke.', 1),
(227, 'Melyik műfaj jellemzője a hősi küzdelem?', 'eposz', 'regény', 'dráma', 'ballada', 3, 'Ókori műfaj.', 1),
(228, 'Melyik stílusirányzat jellemzője a szentimentalizmus?', 'szentimentalizmus', 'klasszicizmus', 'barokk', 'romantika', 3, 'Érzelmek túlhangsúlyozása.', 1),
(229, 'Melyik korszakban alkotott Madách Imre?', '19. század', '18. század', '20. század', '17. század', 3, 'Az Ember tragédiája szerzője.', 1),
(230, 'Melyik műfaj jellemzője a verses elbeszélés?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses formában írt történet.', 1),
(231, 'Melyik évben jelent meg a Nyugat első száma?', '1908', '1914', '1898', '1920', 3, 'A modern magyar irodalom fordulópontja.', 2),
(232, 'Melyik műfaj jellemzője a belső monológ és tudatfolyam?', 'modern regény', 'dráma', 'ballada', 'eposz', 3, '20. századi prózatechnika.', 2),
(233, 'Melyik stílusirányzat jellemzője a szimbolikus képek és hangulatok?', 'szimbolizmus', 'realizmus', 'klasszicizmus', 'barokk', 3, '19. századi költői irányzat.', 2),
(234, 'Melyik korszakban alkotott Franz Kafka?', '20. század eleje', '19. század vége', '18. század', '21. század', 3, 'Az abszurd próza mestere.', 2),
(235, 'Melyik műfaj jellemzője a verses forma és erkölcsi tanulság?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses történet tanító céllal.', 2),
(236, 'Melyik stílusirányzat jellemzője a társadalomkritika és valósághűség?', 'realizmus', 'romantika', 'klasszicizmus', 'szimbolizmus', 3, '19. századi prózai irányzat.', 2),
(237, 'Melyik korszakban alkotott Dante Alighieri?', 'középkor', 'reneszánsz', 'barokk', 'felvilágosodás', 3, 'Az Isteni színjáték szerzője.', 2),
(238, 'Melyik műfaj jellemzője a tragikus hős és erkölcsi konfliktus?', 'tragédia', 'komédia', 'regény', 'ballada', 3, 'Drámai műfaj.', 2),
(239, 'Melyik stílusirányzat jellemzője a szabályosság és mértékletesség?', 'klasszicizmus', 'barokk', 'romantika', 'avantgárd', 3, '18. századi esztétikai elv.', 2),
(240, 'Melyik korszakban alkotott William Shakespeare?', 'reneszánsz', 'barokk', 'klasszicizmus', 'romantika', 3, 'Angol drámaíró.', 2),
(241, 'Melyik műfaj jellemzője a rövid csattanós történet?', 'novella', 'regény', 'dráma', 'eposz', 3, 'Tömör prózai mű.', 2),
(242, 'Melyik stílusirányzat jellemzője a groteszk és abszurd elemek?', 'avantgárd', 'klasszicizmus', 'romantika', 'realizmus', 3, '20. századi kísérleti irodalom.', 2),
(243, 'Melyik korszakban alkotott Goethe?', 'felvilágosodás', 'reneszánsz', 'barokk', 'romantika', 3, 'A Faust szerzője.', 2),
(244, 'Melyik műfaj jellemzője a hősi küzdelem és isteni beavatkozás?', 'eposz', 'regény', 'dráma', 'ballada', 3, 'Homérosz műveinek műfaja.', 2),
(245, 'Melyik stílusirányzat jellemzője a természetközpontúság és érzelem?', 'romantika', 'klasszicizmus', 'barokk', 'szimbolizmus', 3, '19. századi irányzat.', 2),
(246, 'Melyik korszakban alkotott Molière?', 'barokk', 'reneszánsz', 'klasszicizmus', 'felvilágosodás', 3, 'Francia vígjátékíró.', 2),
(247, 'Melyik műfaj jellemzője a tanító célzat és erkölcsi példa?', 'példázat', 'regény', 'dráma', 'ballada', 3, 'Didaktikus irodalom.', 2),
(248, 'Melyik stílusirányzat jellemzője a szentimentalizmus?', 'szentimentalizmus', 'klasszicizmus', 'barokk', 'romantika', 3, 'Érzelmek túlhangsúlyozása.', 2),
(249, 'Melyik korszakban alkotott Arany János?', '19. század', '18. század', '20. század', '17. század', 3, 'Magyar balladaköltészet mestere.', 2),
(250, 'Melyik műfaj jellemzője a verses elbeszélés?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses formában írt történet.', 2),
(251, 'Melyik stílusirányzat jellemzője a vallásos pátosz és túlzás?', 'barokk', 'klasszicizmus', 'realizmus', 'romantika', 3, '17. századi művészet.', 2),
(252, 'Melyik korszakban alkotott Ady Endre?', '20. század eleje', '19. század közepe', '18. század vége', '20. század közepe', 3, 'Modern magyar költészet úttörője.', 2),
(253, 'Melyik műfaj jellemzője a színpadi előadás és párbeszéd?', 'dráma', 'regény', 'eposz', 'ballada', 3, 'Előadásra szánt irodalom.', 2),
(254, 'Melyik stílusirányzat jellemzője a szimbolikus képek és hangulatok?', 'szimbolizmus', 'klasszicizmus', 'realizmus', 'barokk', 3, '19. századi költői irányzat.', 2),
(255, 'Melyik korszakban alkotott Radnóti Miklós?', '20. század', '19. század', '18. század', '21. század', 3, 'Holokauszt-költészet.', 2),
(256, 'Melyik műfaj jellemzője a hősi küzdelem és erkölcsi tanulság?', 'eposz', 'regény', 'dráma', 'ballada', 3, 'Ókori műfaj.', 2),
(257, 'Melyik stílusirányzat jellemzője a szabadságvágy és érzelem?', 'romantika', 'klasszicizmus', 'barokk', 'realizmus', 3, '19. századi irányzat.', 2),
(258, 'Melyik korszakban alkotott Kosztolányi Dezső?', '20. század eleje', '19. század vége', '18. század', '20. század közepe', 3, 'Nyugat első nemzedéke.', 2),
(259, 'Melyik műfaj jellemzője a verses forma és erkölcsi tanulság?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses történet tanító céllal.', 2),
(260, 'Melyik stílusirányzat jellemzője a társadalomkritika és valósághűség?', 'realizmus', 'romantika', 'klasszicizmus', 'szimbolizmus', 3, 'Valósághű ábrázolás.', 2),
(261, 'Melyik évben jelent meg az „Ember tragédiája”?', '1861', '1848', '1872', '1890', 3, 'Madách Imre fő műve.', 3),
(262, 'Melyik irodalmi irányzathoz köthető a „Nyugat” folyóirat?', 'modernizmus', 'klasszicizmus', 'barokk', 'romantika', 3, '20. századi magyar irodalom.', 3),
(263, 'Melyik műfaj jellemzője a tudatfolyam technika?', 'modern regény', 'dráma', 'eposz', 'ballada', 3, '20. századi prózai újítás.', 3),
(264, 'Melyik stílusirányzat jellemzője az abszurd és groteszk?', 'avantgárd', 'klasszicizmus', 'romantika', 'realizmus', 3, 'Modern kísérleti irányzat.', 3),
(265, 'Melyik korszakban alkotott Thomas Mann?', '20. század', '19. század', '18. század', '21. század', 3, 'A „Varázshegy” szerzője.', 3),
(266, 'Melyik műfaj jellemzője a verses forma és erkölcsi tanulság?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses történet tanító céllal.', 3),
(267, 'Melyik stílusirányzat jellemzője a szimbolikus képek és hangulatok?', 'szimbolizmus', 'klasszicizmus', 'realizmus', 'barokk', 3, '19. századi költői irányzat.', 3),
(268, 'Melyik korszakban alkotott Marcel Proust?', '20. század eleje', '19. század vége', '18. század', '21. század', 3, 'A „Az eltűnt idő nyomában” szerzője.', 3),
(269, 'Melyik műfaj jellemzője a tragikus hős és erkölcsi konfliktus?', 'tragédia', 'komédia', 'regény', 'ballada', 3, 'Drámai műfaj.', 3),
(270, 'Melyik stílusirányzat jellemzője a társadalomkritika és valósághűség?', 'realizmus', 'romantika', 'klasszicizmus', 'szimbolizmus', 3, 'Valósághű ábrázolás.', 3),
(271, 'Melyik korszakban alkotott Virginia Woolf?', '20. század', '19. század', '18. század', '21. század', 3, 'A tudatfolyam technika mestere.', 3),
(272, 'Melyik műfaj jellemzője a színpadi előadás és párbeszéd?', 'dráma', 'regény', 'eposz', 'ballada', 3, 'Előadásra szánt irodalom.', 3),
(273, 'Melyik stílusirányzat jellemzője a vallásos pátosz és túlzás?', 'barokk', 'klasszicizmus', 'realizmus', 'romantika', 3, '17. századi művészet.', 3),
(274, 'Melyik korszakban alkotott Albert Camus?', '20. század', '19. század', '18. század', '21. század', 3, 'A „Közöny” szerzője.', 3),
(275, 'Melyik műfaj jellemzője a hősi küzdelem és isteni beavatkozás?', 'eposz', 'regény', 'dráma', 'ballada', 3, 'Homérosz műveinek műfaja.', 3),
(276, 'Melyik stílusirányzat jellemzője a szabadságvágy és érzelem?', 'romantika', 'klasszicizmus', 'barokk', 'realizmus', 3, '19. századi irányzat.', 3),
(277, 'Melyik korszakban alkotott Fjodor Dosztojevszkij?', '19. század', '18. század', '20. század', '17. század', 3, 'Orosz lélektani regények szerzője.', 3),
(278, 'Melyik műfaj jellemzője a rövid csattanós történet?', 'novella', 'regény', 'dráma', 'eposz', 3, 'Tömör prózai mű.', 3),
(279, 'Melyik stílusirányzat jellemzője a szentimentalizmus?', 'szentimentalizmus', 'klasszicizmus', 'barokk', 'romantika', 3, 'Érzelmek túlhangsúlyozása.', 3),
(280, 'Melyik korszakban alkotott T.S. Eliot?', '20. század', '19. század', '18. század', '21. század', 3, 'A „Puszta ország” szerzője.', 3),
(281, 'Melyik műfaj jellemzője a verses elbeszélés?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses formában írt történet.', 3),
(282, 'Melyik stílusirányzat jellemzője a szimbolikus képek és hangulatok?', 'szimbolizmus', 'klasszicizmus', 'realizmus', 'barokk', 3, '19. századi költői irányzat.', 3),
(283, 'Melyik korszakban alkotott Bertolt Brecht?', '20. század', '19. század', '18. század', '21. század', 3, 'Epikus színház megalkotója.', 3),
(284, 'Melyik műfaj jellemzője a tanító célzat és erkölcsi példa?', 'példázat', 'regény', 'dráma', 'ballada', 3, 'Didaktikus irodalom.', 3),
(285, 'Melyik stílusirányzat jellemzője a groteszk és abszurd elemek?', 'avantgárd', 'klasszicizmus', 'romantika', 'realizmus', 3, '20. századi kísérleti irodalom.', 3),
(286, 'Melyik korszakban alkotott Franz Werfel?', '20. század', '19. század', '18. század', '21. század', 3, 'A „A meg nem született gyermek” szerzője.', 3),
(287, 'Melyik műfaj jellemzője a belső monológ és tudatfolyam?', 'modern regény', 'dráma', 'ballada', 'eposz', 3, '20. századi prózatechnika.', 3),
(288, 'Melyik stílusirányzat jellemzője a társadalomkritika és valósághűség?', 'realizmus', 'romantika', 'klasszicizmus', 'szimbolizmus', 3, 'Valósághű ábrázolás.', 3),
(289, 'Melyik korszakban alkotott James Joyce?', '20. század', '19. század', '18. század', '21. század', 3, 'A „Ulysses” szerzője.', 3),
(290, 'Melyik műfaj jellemzője a tragikus hős és erkölcsi konfliktus?', 'tragédia', 'komédia', 'regény', 'ballada', 3, 'Drámai műfaj.', 3),
(291, 'Melyik stílusirányzat jellemzője a szabályosság és mértékletesség?', 'klasszicizmus', 'barokk', 'romantika', 'avantgárd', 3, '18. századi esztétikai elv.', 3),
(292, 'Melyik korszakban alkotott Jean-Paul Sartre?', '20. század', '19. század', '18. század', '21. század', 3, 'Egzisztencialista filozófus és író.', 3),
(293, 'Melyik műfaj jellemzője a verses forma és erkölcsi tanulság?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses történet tanító céllal.', 3),
(294, 'Melyik stílusirányzat jellemzője a természetközpontúság és érzelem?', 'romantika', 'klasszicizmus', 'barokk', 'szimbolizmus', 3, '19. századi irányzat.', 3),
(295, 'Melyik korszakban alkotott Michel Houellebecq?', '21. század', '20. század', '19. század', '18. század', 3, 'Francia kortárs író.', 3),
(296, 'Melyik műfaj jellemzője a verses forma és erkölcsi tanulság?', 'elbeszélő költemény', 'regény', 'dráma', 'ballada', 3, 'Verses történet tanító céllal.', 3),
(297, 'Melyik stílusirányzat jellemzője a szimbolikus képek és hangulatok?', 'szimbolizmus', 'realizmus', 'klasszicizmus', 'barokk', 4, '19. századi művészeti irányzat.', 2),
(298, 'Melyik korszakban alkotott Sylvia Plath?', '20. század', '19. század', '18. század', '21. század', 3, 'Az „Üvegbura” szerzője.', 3),
(299, 'Melyik stílusirányzat jellemzője az egzisztencialista gondolkodás?', 'egzisztencializmus', 'klasszicizmus', 'romantika', 'realizmus', 3, '20. századi filozófiai irányzat.', 3),
(300, 'Melyik műfaj jellemzője a filozófiai párbeszéd?', 'dialógus', 'regény', 'dráma', 'eposz', 3, 'Platon műveinek formája.', 3),
(301, 'Mi a neve annak a hangszernek amelyen billentyűkkel játszanak?', 'zongora', 'hegedű', 'gitár', 'fuvola', 4, 'Billentyűs hangszer.', 1),
(302, 'Melyik korszak zeneszerzője volt Mozart?', 'klasszicizmus', 'barokk', 'romantika', 'modern', 4, '18. századi osztrák zeneszerző.', 1),
(303, 'Melyik hangszercsoportba tartozik a dob?', 'ütőhangszer', 'fúvós', 'húros', 'billentyűs', 4, 'Alapritmust adó hangszer.', 1),
(304, 'Melyik országban alakult a Beatles?', 'Egyesült Királyság', 'USA', 'Németország', 'Ausztrália', 4, 'Liverpoolból indult zenekar.', 1),
(305, 'Melyik műfajra jellemző a freestyle rap?', 'hiphop', 'klasszikus', 'jazz', 'rock', 4, 'Improvizatív szövegmondás.', 1),
(306, 'Melyik hangszerhez tartozik a vonó?', 'hegedű', 'zongora', 'fuvola', 'dob', 4, 'Húros hangszer.', 1),
(307, 'Melyik zeneszerző írta a „Für Elise”-t?', 'Beethoven', 'Mozart', 'Bach', 'Chopin', 4, 'Klasszikus zongoradarab.', 1),
(308, 'Melyik hangszert fújják?', 'fuvola', 'gitár', 'zongora', 'hegedű', 4, 'Fafúvós hangszer.', 1),
(309, 'Melyik műfajhoz tartozik Bob Marley?', 'reggae', 'rock', 'jazz', 'rap', 4, 'Jamaicai zenei stílus.', 1),
(310, 'Melyik hangszer NEM húros?', 'dob', 'gitár', 'hegedű', 'cselló', 4, 'Ritmushangszer.', 1),
(311, 'Melyik zenekar énekelte a „Bohemian Rhapsody”-t?', 'Queen', 'The Beatles', 'U2', 'ABBA', 4, 'Freddie Mercury ikonikus dala.', 1),
(312, 'Melyik országban született Chopin?', 'Lengyelország', 'Franciaország', 'Németország', 'Olaszország', 4, 'Romantikus zongorista.', 1),
(313, 'Melyik műfajra jellemző az improvizáció?', 'jazz', 'klasszikus', 'techno', 'opera', 4, 'Spontán hangszeres játék.', 1),
(314, 'Melyik hangszer tartozik a fúvós családba?', 'klarinét', 'gitár', 'zongora', 'cselló', 4, 'Fúvós hangszer.', 1),
(315, 'Mi a neve annak a hangszernek amelyet bottal ütnek?', 'dob', 'hegedű', 'zongora', 'fuvola', 4, 'Ütőhangszer.', 1),
(316, 'Melyik zeneszerző írta a „Tavaszi szonátát”?', 'Beethoven', 'Mozart', 'Bach', 'Schubert', 4, 'Klasszikus szonáta.', 1),
(317, 'Melyik zenei stílus született New Orleansban?', 'jazz', 'blues', 'rock', 'reggae', 4, 'Amerikai gyökerű műfaj.', 1),
(318, 'Melyik zenekar énekelte a „Let It Be”-t?', 'The Beatles', 'Queen', 'U2', 'ABBA', 4, 'Klasszikus popdal.', 1),
(319, 'Melyik hangszer NEM szerepel egy szimfonikus zenekarban?', 'elektromos gitár', 'hegedű', 'cselló', 'fuvola', 4, 'Modern hangszer.', 1),
(320, 'Melyik zeneszerző volt vak?', 'Bach', 'Beethoven', 'Mozart', 'Haydn', 4, 'Barokk mester.', 1),
(321, 'Melyik műfajra jellemző a négynegyedes ütem?', 'pop', 'klasszikus', 'opera', 'gregorián', 4, 'Leggyakoribb ritmus.', 1),
(322, 'Melyik hangszer NEM fúvós?', 'zongora', 'fuvola', 'trombita', 'szaxofon', 4, 'Billentyűs hangszer.', 1),
(323, 'Melyik zeneszerző írta a „Diótörő” balettet?', 'Csajkovszkij', 'Beethoven', 'Mozart', 'Bach', 4, 'Orosz romantikus zeneszerző.', 1),
(324, 'Melyik országban alakult az ABBA?', 'Svédország', 'Norvégia', 'Németország', 'Anglia', 4, 'Popzenei ikon.', 1),
(325, 'Melyik zenei korszakban alkotott Vivaldi?', 'barokk', 'klasszicizmus', 'romantika', 'modern', 4, 'A „Négy évszak” szerzője.', 1),
(326, 'Melyik hangszer NEM ütőhangszer?', 'hegedű', 'dob', 'marimba', 'kongó', 4, 'Húros hangszer.', 1),
(327, 'Melyik műfajra jellemző a versszakos szerkezet?', 'népdal', 'szimfónia', 'rap', 'opera', 4, 'Egyszerű ismétlődő forma.', 1),
(328, 'Melyik zeneszerző írta a „Holdfény szonátát”?', 'Beethoven', 'Mozart', 'Bach', 'Schubert', 4, 'Klasszikus zongoradarab.', 1),
(329, 'Melyik hangszer tartozik a rézfúvósok közé?', 'trombita', 'fuvola', 'hegedű', 'zongora', 4, 'Fémtestű fúvós hangszer.', 1),
(330, 'Mi a neve annak a zenei műfajnak amelyben a szöveg ritmusos beszéd?', 'rap', 'opera', 'népdal', 'szimfónia', 4, 'Verses ritmikus előadás.', 1),
(331, 'Mi jellemző a barokk zenére?', 'polifónia és díszítettség', 'egyszerű dallam', 'szabad improvizáció', 'elektronikus hangzás', 4, '17–18. századi stílus.', 2),
(332, 'Hány tételből áll általában egy klasszikus szimfónia?', 'négy', 'öt', 'három', 'hat', 4, 'Klasszikus forma.', 2),
(333, 'Mi a kadencia a zeneelméletben?', 'zárlat', 'ritmusváltás', 'hangszín', 'hangnemváltás', 4, 'Zenei mondat lezárása.', 2),
(334, 'Melyik zeneszerző volt a romantika egyik vezéralakja?', 'Chopin', 'Mozart', 'Bach', 'Haydn', 4, '19. századi lengyel zongorista.', 2),
(335, 'Melyik hangszer transzponáló?', 'klarinét', 'zongora', 'hegedű', 'cselló', 4, 'Hangnemváltás szükséges.', 2),
(336, 'Mi a különbség a duett és a tercett között?', 'két vs három énekes', 'egy vs két hangszer', 'lassú vs gyors tempó', 'szöveges vs hangszeres', 4, 'Énekesek száma.', 2),
(337, 'Melyik korszakban jelent meg az opera?', 'barokk', 'klasszicizmus', 'romantika', 'modern', 4, 'Zene és színház találkozása.', 2),
(338, 'Melyik hangszer NEM szerepel a jazz standard felállásban?', 'cselló', 'zongora', 'dob', 'szaxofon', 4, 'Nem jellemző vonós.', 2),
(339, 'Mi a különbség a moll és dúr hangnem között?', 'hangulat', 'sebesség', 'hangszín', 'ritmus', 4, 'Moll: szomorú dúr: vidám.', 2),
(340, 'Melyik zeneszerző volt vak élete végén?', 'Bach', 'Beethoven', 'Mozart', 'Schubert', 4, 'Barokk mester.', 2),
(341, 'Mi a basso continuo?', 'folyamatos basszus', 'gyors ritmus', 'hangnemváltás', 'szöveges kórus', 4, 'Barokk kísérő technika.', 2),
(342, 'Melyik műfajban jellemző a recitativo?', 'opera', 'szimfónia', 'jazz', 'népdal', 4, 'Énekbeszéd.', 2),
(343, 'Mi a különbség a szonáta és a szimfónia között?', 'előadók száma', 'tételszám', 'hangnem', 'ritmus', 4, 'Szonáta: szóló szimfónia: zenekar.', 2),
(344, 'Melyik zeneszerző írta a „Bolero”-t?', 'Ravel', 'Debussy', 'Bizet', 'Chopin', 4, 'Francia impresszionista.', 2),
(345, 'Mi a szerepe a karmesternek?', 'irányítja az előadást', 'hangszert játszik', 'szöveget énekel', 'ritmust ad', 4, 'Zenei vezető.', 2),
(346, 'Melyik hangszer NEM billentyűs?', 'hegedű', 'zongora', 'orgona', 'szintetizátor', 4, 'Húros hangszer.', 2),
(347, 'Mi a különbség a fugato és a fuga között?', 'részleges vs teljes imitáció', 'gyors vs lassú', 'hangnemváltás', 'ritmusváltás', 4, 'Forma és szerkezet.', 2),
(348, 'Melyik zeneszerző volt a programzene mestere?', 'Liszt', 'Mozart', 'Bach', 'Haydn', 4, 'Zene amely történetet mesél.', 2),
(349, 'Mi a szerepe a tételnek egy zeneműben?', 'önálló egység', 'hangnemváltás', 'ritmusváltás', 'szöveges rész', 4, 'Szimfónia része.', 2),
(350, 'Melyik korszakban alkotott Debussy?', 'impresszionizmus', 'romantika', 'klasszicizmus', 'barokk', 4, 'Francia zeneszerző.', 2),
(351, 'Mi a különbség a prelúdium és a szonáta között?', 'bevezető vs teljes mű', 'gyors vs lassú', 'hangnemváltás', 'ritmusváltás', 4, 'Prelúdium: előhang.', 2),
(352, 'Melyik hangszer NEM fúvós?', 'cselló', 'fuvola', 'trombita', 'szaxofon', 4, 'Húros hangszer.', 2),
(353, 'Mi jellemző a gregorián énekre?', 'egyszólamúság', 'többszólamúság', 'ritmusváltás', 'hangnemváltás', 4, 'Középkori egyházi zene.', 2),
(354, 'Melyik zeneszerző írta a „Carmina Burana”-t?', 'Carl Orff', 'Bach', 'Mozart', 'Beethoven', 4, '20. századi német zeneszerző.', 2),
(355, 'Mi a különbség a szvit és a szimfónia között?', 'tánctételek vs zenekari mű', 'szöveges vs hangszeres', 'lassú vs gyors', 'hangnemváltás', 4, 'Szvit: táncok sorozata.', 2),
(356, 'Melyik műfajban jellemző a vers és zene kapcsolata?', 'dal', 'szimfónia', 'rap', 'opera', 4, 'Énekelt költészet.', 2),
(357, 'Mi a szerepe a csembalónak a barokk zenében?', 'kísérő hangszer', 'szóló hangszer', 'ritmushangszer', 'énekes kísérője', 4, 'Basso continuo része.', 2);
INSERT INTO `kerdesek` (`kerdesek_id`, `kerdesek_kerdes`, `kerdesek_helyesValasz`, `kerdesek_helytelenValasz1`, `kerdesek_helytelenValasz2`, `kerdesek_helytelenValasz3`, `kerdesek_kategoria`, `kerdesek_leiras`, `kerdesek_nehezseg`) VALUES
(358, 'Melyik zeneszerző volt a minimalizmus képviselője?', 'Philip Glass', 'John Cage', 'Igor Stravinsky', 'Claude Debussy', 4, 'Ismétlődő motívumok.', 2),
(359, 'Mi a különbség a kánon és a fuga között?', 'szabályos vs szabad imitáció', 'gyors vs lassú', 'hangnemváltás', 'ritmusváltás', 4, 'Forma és szerkesztés.', 2),
(360, 'Melyik hangszer NEM szerepel a vonósnégyesben?', 'zongora', 'hegedű', 'brácsa', 'cselló', 4, 'Billentyűs hangszer.', 2),
(361, 'Melyik évben jelent meg Beethoven 9. szimfóniája?', '1824', '1801', '1830', '1795', 4, 'A „Örömóda” szimfóniája.', 3),
(362, 'Mi jellemzi az atonális zenét?', 'nincs hangnem', 'lassú tempó', 'egyszerű ritmus', 'szöveges rész', 4, '20. századi újítás.', 3),
(363, 'Mi a különbség a dodekafónia és a tonalitás között?', 'hangnem nélküli vs hangnem alapú', 'gyors vs lassú', 'szöveges vs hangszeres', 'ritmusváltás', 4, 'Schoenberg technikája.', 3),
(364, 'Melyik zeneszerző alkotta meg a 12 fokú sorozatot?', 'Schoenberg', 'Berg', 'Webern', 'Stravinsky', 4, 'Dodekafónia atyja.', 3),
(365, 'Mi a szerepe a motívumnak egy zeneműben?', 'építőelem', 'tétel', 'hangnem', 'ritmus', 4, 'Zenei gondolat.', 3),
(366, 'Melyik korszakban alkotott Igor Stravinsky?', '20. század', '19. század', '18. század', '21. század', 4, 'A „Tavaszi áldozat” szerzője.', 3),
(367, 'Mi a különbség a szekvencia és az imitáció között?', 'ismétlés vs utánzás', 'gyors vs lassú', 'hangnemváltás', 'ritmusváltás', 4, 'Zenei szerkesztési mód.', 3),
(368, 'Melyik zeneszerző volt a Neue Musik egyik vezéralakja?', 'Webern', 'Schoenberg', 'Berg', 'Boulez', 4, '20. századi avantgárd.', 3),
(369, 'Mi a szerepe a kromatikának a zenében?', 'hangnem színezése', 'ritmusváltás', 'szöveges rész', 'hangszeres váltás', 4, 'Félhangos mozgás.', 3),
(370, 'Melyik műfajban jellemző a szabad forma?', 'szabad improvizáció', 'szimfónia', 'szonáta', 'opera', 4, 'Modern zenei irányzat.', 3),
(371, 'Mi a különbség a aleatória és a improvizáció között?', 'előre meghatározott vs szabad', 'gyors vs lassú', 'hangnemváltás', 'ritmusváltás', 4, 'John Cage technikája.', 3),
(372, 'Melyik zeneszerző írta a „Tavaszi áldozat”-ot?', 'Stravinsky', 'Schoenberg', 'Berg', 'Debussy', 4, 'Balettbotrány Párizsban.', 3),
(373, 'Mi a szerepe a szekvenciának a zenében?', 'motívum ismétlése különböző hangmagasságokon', 'ritmusváltás', 'hangnemváltás', 'szöveges rész', 4, 'Szerkesztési technika.', 3),
(374, 'Melyik zeneszerző volt a minimalizmus képviselője?', 'Philip Glass', 'Steve Reich', 'John Adams', 'Terry Riley', 4, 'Ismétlődő motívumok.', 3),
(375, 'Mi a különbség a modális és a tonális zene között?', 'skálák vs hangnem', 'gyors vs lassú', 'hangszín', 'ritmus', 4, 'Modális: középkori eredet.', 3),
(376, 'Melyik zeneszerző írta a „Puszta ország”-ot?', 'T.S. Eliot', 'Philip Glass', 'John Cage', 'Igor Stravinsky', 4, 'Vers nem zenemű.', 3),
(377, 'Mi jellemzi a szimbolista zenét?', 'hangulatfestés', 'szöveges rész', 'ritmusváltás', 'hangnemváltás', 4, 'Debussy stílusa.', 3),
(378, 'Melyik zeneszerző volt a futurizmus zenei képviselője?', 'Luigi Russolo', 'Igor Stravinsky', 'Arnold Schoenberg', 'Claude Debussy', 4, 'Zajzene úttörője.', 3),
(379, 'Mi a különbség a mikrotonalitás és a kromatika között?', 'félhang alatti vs félhangos mozgás', 'gyors vs lassú', 'hangszín', 'ritmus', 4, 'Modern hangrendszer.', 3),
(380, 'Melyik zeneszerző írta a „Music for 18 Musicians”-t?', 'Steve Reich', 'Philip Glass', 'John Adams', 'Terry Riley', 4, 'Minimalista remekmű.', 3),
(381, 'Mi jellemzi a spektrális zenét?', 'hangszín alapú szerkesztés', 'ritmusváltás', 'szöveges rész', 'hangnemváltás', 4, '20. századi francia irányzat.', 3),
(382, 'Melyik zeneszerző volt a spektrális zene úttörője?', 'Grisey', 'Murail', 'Boulez', 'Stockhausen', 4, 'Hangszínkutatás.', 3),
(383, 'Mi a különbség a elektronikus és elektroakusztikus zene között?', 'digitális vs analóg forrás', 'gyors vs lassú', 'hangszín', 'ritmus', 4, 'Technikai különbség.', 3),
(384, 'Melyik zeneszerző írta a „Poème électronique”-ot?', 'Edgard Varèse', 'Stockhausen', 'Boulez', 'Cage', 4, 'Elektronikus zenei klasszikus.', 3),
(385, 'Mi jellemzi a konceptuális zenét?', 'ötlet a középpontban', 'nincs hang', 'ritmusváltás', 'hangnemváltás', 4, 'John Cage irányzata.', 3),
(386, 'Melyik zeneszerző írta a „4’33””-t?', 'John Cage', 'Philip Glass', 'Steve Reich', 'Terry Riley', 4, 'Csend művészete.', 3),
(387, 'Mi a különbség a hangszín és a hangmagasság között?', 'minőség vs frekvencia', 'gyors vs lassú', 'ritmus', 'szöveg', 4, 'Akusztikai fogalom.', 3),
(388, 'Melyik zeneszerző volt a szintetizátor úttörője?', 'Wendy Carlos', 'Bob Moog', 'Brian Eno', 'Jean-Michel Jarre', 4, '„Switched-On Bach” alkotója.', 3),
(389, 'Mi jellemzi a ambient zenét?', 'hangulatközpontúság', 'ritmusváltás', 'szöveges rész', 'hangnemváltás', 4, 'Brian Eno stílusa.', 3),
(390, 'Melyik zeneszerző írta a „Oxygène”-t?', 'Jean-Michel Jarre', 'Brian Eno', 'Wendy Carlos', 'Kraftwerk', 4, 'Elektronikus zenei klasszikus.', 3),
(391, 'Mi a különbség a groove és a beat között?', 'érzet vs alapritmus', 'gyors vs lassú', 'hangszín', 'szöveg', 4, 'Ritmikai fogalom.', 3),
(392, 'Melyik zeneszerző volt a krautrock egyik alapítója?', 'Kraftwerk', 'Can', 'Neu!', 'Tangerine Dream', 4, 'Német elektronikus zene.', 3),
(393, 'Mi jellemzi a poliritmiát?', 'több ritmus egyidejűleg', 'hangnemváltás', 'szöveg', 'hangszín', 4, 'Komplex ritmikai szerkezet.', 3),
(394, 'Melyik zeneszerző írta a „Different Trains”-t?', 'Steve Reich', 'Philip Glass', 'John Adams', 'Terry Riley', 4, 'Minimalista vonatkompozíció.', 3),
(395, 'Mi a különbség a forma és a struktúra között?', 'elrendezés vs felépítés', 'gyors vs lassú', 'hangszín', 'ritmus', 4, 'Zeneelméleti fogalom.', 3),
(396, 'Melyik zeneszerző volt a hanginstallációk úttörője?', 'Max Neuhaus', 'Brian Eno', 'John Cage', 'Steve Reich', 4, 'Térbeli hangművészet.', 3),
(397, 'Mi jellemzi a glitch zenét?', 'hibák hangzásként', 'szöveg', 'ritmusváltás', 'hangnemváltás', 4, 'Digitális zenei irányzat.', 3),
(398, 'Melyik zeneszerző írta a „Disintegration Loops”-t?', 'William Basinski', 'Brian Eno', 'Steve Reich', 'Philip Glass', 4, 'Magnetofonszalag bomlása.', 3),
(399, 'Mi a különbség a remix és a mashup között?', 'újragondolás vs keverés', 'eredeti vs feldolgozás', 'lassú vs gyors', 'hangnem vs ritmus', 4, 'Zenei újraértelmezés vs több dal kombinálása.', 3),
(400, 'Melyik zeneszerző írta a „Bolero” című művet?', 'Ravel', 'Bach', 'Beethoven', 'Debussy', 4, 'Ismétlődő ritmusú francia darab.', 3),
(401, 'Hány percig tart egy hivatalos futballmérkőzés?', '90', '60', '80', '100', 5, 'Két félidőből áll.', 1),
(402, 'Hány játékos van egy kosárlabdacsapatban egyszerre a pályán?', '5', '6', '7', '4', 5, 'Alapfelállás.', 1),
(403, 'Melyik sportban használják a palánkot?', 'kosárlabda', 'foci', 'tenisz', 'röplabda', 5, 'Dobás célfelülete.', 1),
(404, 'Hány gyűrű van az olimpiai zászlón?', '5', '4', '6', '7', 5, 'Kontinensek jelképei.', 1),
(405, 'Melyik sportban van tizenegyes rúgás?', 'foci', 'kosárlabda', 'tenisz', 'vívás', 5, 'Büntetőrúgás.', 1),
(406, 'Hány játékos van egy kézilabdacsapatban a pályán?', '7', '6', '8', '9', 5, 'Labdás csapatsport.', 1),
(407, 'Melyik sportban használják a pingponglabdát?', 'asztalitenisz', 'tenisz', 'foci', 'kosárlabda', 5, 'Kis ütős játék.', 1),
(408, 'Hány pontot ér egy touchdown az amerikai fociban?', '6', '3', '5', '7', 5, 'Pontszerzés módja.', 1),
(409, 'Melyik sportban van szerva és gém?', 'tenisz', 'foci', 'kosárlabda', 'úszás', 5, 'Ütős pályajáték.', 1),
(410, 'Hány játékos van egy röplabdacsapatban a pályán?', '6', '5', '7', '8', 5, 'Háló fölött játszott csapatjáték.', 1),
(411, 'Melyik sportban van ring?', 'ökölvívás', 'foci', 'tenisz', 'úszás', 5, 'Küzdősport.', 1),
(412, 'Hány pontot ér egy hárompontos dobás kosárlabdában?', '3', '2', '1', '4', 5, 'Távoli találat.', 1),
(413, 'Melyik sportban van kapus?', 'foci', 'tenisz', 'röplabda', 'asztalitenisz', 5, 'Védelmi szerep.', 1),
(414, 'Hány szettből áll egy Grand Slam döntő férfi teniszben?', '5', '3', '4', '2', 5, 'Hosszú mérkőzés.', 1),
(415, 'Melyik sportban van súlylökés?', 'atlétika', 'foci', 'tenisz', 'úszás', 5, 'Dobószám.', 1),
(416, 'Hány játékos van egyszerre a jégkorongpályán egy csapatból?', '6', '5', '7', '11', 5, 'Jégen játszott csapatsport.', 1),
(417, 'Melyik sportban van sarokdobás?', 'foci', 'kosárlabda', 'tenisz', 'röplabda', 5, 'Szöglet.', 1),
(418, 'Hány pontot ér egy gól a fociban?', '1', '2', '3', '4', 5, 'Alap pontszerzés.', 1),
(419, 'Melyik sportban van pompom?', 'cheerleading', 'foci', 'tenisz', 'atlétika', 5, 'Látványos csapatmozgás.', 1),
(420, 'Hány játékos van egy vízilabdacsapatban a vízben?', '7', '6', '8', '9', 5, 'Vizes csapatsport.', 1),
(421, 'Melyik sportban van bicikli?', 'kerékpár', 'futás', 'foci', 'tenisz', 5, 'Kétkerekű sport.', 1),
(422, 'Hány pontot ér egy büntetődobás kosárlabdában?', '1', '2', '3', '4', 5, 'Szabálytalanság után.', 1),
(423, 'Melyik sportban van célfotó?', 'atlétika', 'foci', 'tenisz', 'úszás', 5, 'Gyorsasági döntés.', 1),
(424, 'Hány játékos van egy baseballcsapatban a pályán?', '9', '8', '10', '11', 5, 'Amerikai sport.', 1),
(425, 'Melyik sportban van vívótőr?', 'vívás', 'foci', 'tenisz', 'úszás', 5, 'Kardos sportág.', 1),
(426, 'Hány pontot ér egy büntetőrúgás a rögbiben?', '3', '2', '5', '4', 5, 'Pontszerzés módja.', 1),
(427, 'Melyik sportban van palánkra dobás?', 'kosárlabda', 'foci', 'tenisz', 'röplabda', 5, 'Dobás célfelülete.', 1),
(428, 'Hány játékos van egy krikettcsapatban?', '11', '10', '9', '12', 5, 'Labdás ütős játék.', 1),
(429, 'Melyik sportban van síugrás?', 'síelés', 'futás', 'foci', 'tenisz', 5, 'Téli extrém sport.', 1),
(430, 'Hány pontot ér egy büntetőrúgás a fociban?', '1', '2', '3', '4', 5, 'Büntetőhelyzet.', 1),
(431, 'Melyik évben rendezték az első modern olimpiát?', '1896', '1900', '1888', '1912', 5, 'Athénban indult újra.', 2),
(432, 'Hány játékos van egy baseballcsapatban a pályán?', '9', '8', '10', '11', 5, 'Amerikai sport.', 2),
(433, 'Melyik városban rendezték a 2012-es nyári olimpiát?', 'London', 'Rio', 'Peking', 'Athén', 5, 'Brit főváros.', 2),
(434, 'Hány percig tart egy hivatalos kosárlabdamérkőzés?', '40', '48', '60', '30', 5, 'Nemzetközi szabályok szerint.', 2),
(435, 'Melyik sportban használják a scrum kifejezést?', 'rögbi', 'foci', 'kosárlabda', 'tenisz', 5, 'Labdáért való küzdelem.', 2),
(436, 'Hány játékos van egy vízilabdacsapatban a vízben?', '7', '6', '8', '9', 5, 'Vizes csapatsport.', 2),
(437, 'Melyik városban rendezték a 2008-as nyári olimpiát?', 'Peking', 'Rio', 'London', 'Sydney', 5, 'Kínai főváros.', 2),
(438, 'Hány pontot ér egy büntetőrúgás a rögbiben?', '3', '2', '5', '4', 5, 'Pontszerzés módja.', 2),
(439, 'Melyik sportban használják az icing szabályt?', 'jégkorong', 'foci', 'tenisz', 'úszás', 5, 'Passzszabály jégen.', 2),
(440, 'Hány játékos van egy krikettcsapatban?', '11', '10', '9', '12', 5, 'Labdás ütős játék.', 2),
(441, 'Melyik városban rendezték a 2016-os nyári olimpiát?', 'Rio de Janeiro', 'London', 'Peking', 'Athén', 5, 'Brazil város.', 2),
(442, 'Hány pontot ér egy büntetődobás kosárlabdában?', '1', '2', '3', '4', 5, 'Szabálytalanság után.', 2),
(443, 'Melyik sportban használják a break és frame kifejezéseket?', 'snooker', 'tenisz', 'foci', 'kosárlabda', 5, 'Billiárd alapú játék.', 2),
(444, 'Hány játékos van egy kézilabdacsapatban a pályán?', '7', '6', '8', '9', 5, 'Labdás csapatsport.', 2),
(445, 'Melyik városban rendezték az 1980-as nyári olimpiát?', 'Moszkva', 'Los Angeles', 'Szöul', 'Montreal', 5, 'Szovjetunió fővárosa.', 2),
(446, 'Hány pontot ér egy touchdown az amerikai fociban?', '6', '3', '5', '7', 5, 'Pontszerzés módja.', 2),
(447, 'Melyik sportban használják a pompomot?', 'cheerleading', 'foci', 'tenisz', 'atlétika', 5, 'Látványos csapatmozgás.', 2),
(448, 'Hány játékos van egy röplabdacsapatban a pályán?', '6', '5', '7', '8', 5, 'Háló fölött játszott csapatjáték.', 2),
(449, 'Melyik városban rendezték az 1992-es nyári olimpiát?', 'Barcelona', 'Atlanta', 'Sydney', 'Athén', 5, 'Spanyol város.', 2),
(450, 'Hány pontot ér egy gól a fociban?', '1', '2', '3', '4', 5, 'Alap pontszerzés.', 2),
(451, 'Melyik sportban használják a vívótőrt?', 'vívás', 'foci', 'tenisz', 'úszás', 5, 'Kardos sportág.', 2),
(452, 'Hány játékos van egy jégkorongcsapatban egyszerre a pályán?', '6', '5', '7', '11', 5, 'Jégen játszott csapatsport.', 2),
(453, 'Melyik városban rendezték a 2000-es nyári olimpiát?', 'Sydney', 'Athén', 'Atlanta', 'London', 5, 'Ausztrál város.', 2),
(454, 'Hány pontot ér egy hárompontos dobás kosárlabdában?', '3', '2', '1', '4', 5, 'Távoli találat.', 2),
(455, 'Melyik sportban van súlylökés?', 'atlétika', 'foci', 'tenisz', 'úszás', 5, 'Dobószám.', 2),
(456, 'Hány játékos van egy focicsapatban a pályán?', '11', '10', '9', '12', 5, 'Labdarúgás szabályai.', 2),
(457, 'Melyik városban rendezték az 1972-es nyári olimpiát?', 'München', 'Montreal', 'Tokió', 'Róma', 5, 'Német város.', 2),
(458, 'Hány pontot ér egy büntetőrúgás a fociban?', '1', '2', '3', '4', 5, 'Büntetőhelyzet.', 2),
(459, 'Melyik sportban van palánkra dobás?', 'kosárlabda', 'foci', 'tenisz', 'röplabda', 5, 'Dobás célfelülete.', 2),
(460, 'Hány gyűrű van az olimpiai zászlón?', '5', '4', '6', '7', 5, 'Kontinensek jelképei.', 2),
(461, 'Ki volt az első magyar olimpiai bajnok?', 'Hajós Alfréd', 'Puskás Ferenc', 'Egerszegi Krisztina', 'Darnyi Tamás', 5, '1896-ban úszásban nyert.', 3),
(462, 'Melyik évben rendezték az első modern olimpiát?', '1896', '1900', '1888', '1912', 5, 'Athénban indult újra.', 3),
(463, 'Hány olimpiai aranyérmet nyert Egerszegi Krisztina?', '5', '4', '6', '3', 5, 'Hátúszásban és vegyesben.', 3),
(464, 'Melyik városban rendezték az 1936-os olimpiát?', 'Berlin', 'Róma', 'Athén', 'London', 5, 'Németország fővárosa.', 3),
(465, 'Ki volt a legeredményesebb magyar vívó?', 'Gerevich Aladár', 'Kovács István', 'Balogh Károly', 'Fazekas Mihály', 5, '7 olimpiai arany.', 3),
(466, 'Melyik sportágban nyert Puskás Ferenc hírnevet?', 'labdarúgás', 'kosárlabda', 'vívás', 'tenisz', 5, 'Az Aranycsapat kapitánya.', 3),
(467, 'Melyik városban rendezték az 1952-es olimpiát?', 'Helsinki', 'Róma', 'London', 'Tokió', 5, 'Finnország fővárosa.', 3),
(468, 'Hány aranyérmet nyert Hosszú Katinka Rióban?', '3', '2', '4', '1', 5, '2016 Iron Lady.', 3),
(469, 'Melyik sportágban nyert Darnyi Tamás olimpiai aranyat?', 'úszás', 'vívás', 'futás', 'kerékpár', 5, '400 vegyesben.', 3),
(470, 'Melyik városban rendezték az 1964-es olimpiát?', 'Tokió', 'Róma', 'Mexikóváros', 'Montreal', 5, 'Ázsiai olimpia.', 3),
(471, 'Ki volt az első női magyar olimpiai bajnok?', 'Keleti Ágnes', 'Egerszegi Krisztina', 'Hosszú Katinka', 'Gerevich Aladár', 5, 'Torna 1952 Helsinki.', 3),
(472, 'Melyik városban rendezték az 1976-os olimpiát?', 'Montreal', 'München', 'Szöul', 'Sydney', 5, 'Kanadai város.', 3),
(473, 'Hány aranyérmet nyert Kovács Katalin kajakban?', '3', '2', '4', '5', 5, 'Olimpiai bajnok kajakozó.', 3),
(474, 'Melyik sportágban nyert Balczó András olimpiai aranyat?', 'öttusa', 'futás', 'vívás', 'úszás', 5, 'Magyar legenda.', 3),
(475, 'Melyik városban rendezték az 1988-as olimpiát?', 'Szöul', 'Los Angeles', 'Moszkva', 'Sydney', 5, 'Dél-Korea fővárosa.', 3),
(476, 'Hány olimpiai aranyérmet nyert a magyar vízilabda válogatott 2000–2008 között?', '3', '2', '4', '1', 5, 'Zsinórban három győzelem.', 3),
(477, 'Melyik sportágban nyert Pars Krisztián olimpiai aranyat?', 'kalapácsvetés', 'futás', 'úszás', 'vívás', 5, '2012 London.', 3),
(478, 'Melyik városban rendezték az 1924-es olimpiát?', 'Párizs', 'Athén', 'Róma', 'London', 5, 'Francia főváros.', 3),
(479, 'Hány aranyérmet nyert Egerszegi Krisztina Barcelonában?', '3', '2', '4', '1', 5, '1992-es olimpia.', 3),
(480, 'Melyik sportágban nyert Csipes Tamara olimpiai aranyat?', 'kajak', 'foci', 'vívás', 'úszás', 5, '2020 Tokió.', 3),
(481, 'Melyik városban rendezték az 2004-es olimpiát?', 'Athén', 'Sydney', 'London', 'Peking', 5, 'Görögország fővárosa.', 3),
(482, 'Hány aranyérmet nyert a magyar tornász Keleti Ágnes?', '5', '4', '3', '6', 5, '1952–1956 között.', 3),
(483, 'Melyik sportágban nyert Janics Natasa olimpiai aranyat?', 'kajak', 'vívás', 'úszás', 'foci', 5, '2004 Athén.', 3),
(484, 'Melyik városban rendezték az 1968-as olimpiát?', 'Mexikóváros', 'Róma', 'Tokió', 'Montreal', 5, 'Latin-Amerika.', 3),
(485, 'Hány aranyérmet nyert a magyar vívó Kovács István?', '3', '2', '4', '5', 5, 'Olimpiai bajnok.', 3),
(486, 'Melyik sportágban nyert Gyurta Dániel olimpiai aranyat?', 'úszás', 'foci', 'vívás', 'atlétika', 5, '200 m mell 2012 London.', 3),
(487, 'Melyik városban rendezték az 1996-os olimpiát?', 'Atlanta', 'Sydney', 'Athén', 'London', 5, 'USA déli városa.', 3),
(488, 'Hány aranyérmet nyert a magyar kajakos Douchev-Janics Natasa?', '3', '2', '4', '1', 5, 'Olimpiai bajnok.', 3),
(489, 'Melyik sportágban nyert Kiss László olimpiai aranyat?', 'úszás', 'foci', 'vívás', 'atlétika', 5, 'Magyar úszóedző legendája.', 3),
(490, 'Melyik városban rendezték az 1984-es olimpiát?', 'Los Angeles', 'Moszkva', 'Szöul', 'Sydney', 5, 'USA nyugati part.', 3),
(491, 'Hány aranyérmet nyert a magyar vízilabda válogatott összesen?', '9', '8', '10', '7', 5, 'Olimpiai rekord.', 3),
(492, 'Melyik sportágban nyert Kovács Katalin és Janics Natasa párosban?', 'kajak', 'foci', 'vívás', 'úszás', 5, 'Arany páros.', 3),
(493, 'Melyik városban rendezték az 1972-es olimpiát?', 'München', 'Montreal', 'Tokió', 'Róma', 5, 'Német város.', 3),
(494, 'Hány aranyérmet nyert a magyar úszó Darnyi Tamás?', '4', '3', '5', '2', 5, '1988–1992.', 3),
(495, 'Melyik sportágban nyert Szabó Gabriella olimpiai aranyat?', 'kajak', 'vívás', 'úszás', 'foci', 5, '2012 London.', 3),
(496, 'Melyik városban rendezték az 1960-as olimpiát?', 'Róma', 'Athén', 'Tokió', 'London', 5, 'Olasz főváros.', 3),
(497, 'Hány aranyérmet nyert a magyar vívó Gerevich Aladár?', '7', '6', '5', '8', 5, 'Olimpiai rekord.', 3),
(498, 'Melyik sportágban nyert Egerszegi Krisztina öt aranyat?', 'úszás', 'foci', 'vívás', 'atlétika', 5, 'Hátúszás és vegyes.', 3),
(499, 'Melyik városban rendezték az 2000-es olimpiát?', 'Sydney', 'Athén', 'Atlanta', 'London', 5, 'Ausztrál város.', 3),
(500, 'Hány aranyérmet nyert a magyar kajakos Kovács Katalin?', '3', '2', '4', '5', 5, 'Olimpiai bajnok.', 3);

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
-- A tábla indexei `eredmenyek`
--
ALTER TABLE `eredmenyek`
  ADD PRIMARY KEY (`Eredmenyek_id`),
  ADD KEY `Eredmenyek_jatekos` (`Eredmenyek_jatekos`,`Eredmenyek_kategoria`),
  ADD KEY `Eredmenyek_kategoria` (`Eredmenyek_kategoria`);

--
-- A tábla indexei `jatekos`
--
ALTER TABLE `jatekos`
  ADD PRIMARY KEY (`jatekos_id`),
  ADD UNIQUE KEY `jatekos_nev` (`jatekos_nev`);

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
-- A tábla indexei `nyeremeny`
--
ALTER TABLE `nyeremeny`
  ADD PRIMARY KEY (`nyeremeny_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `eredmenyek`
--
ALTER TABLE `eredmenyek`
  MODIFY `Eredmenyek_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jatekos`
--
ALTER TABLE `jatekos`
  MODIFY `jatekos_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `kategoria`
--
ALTER TABLE `kategoria`
  MODIFY `kategoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `kerdesek`
--
ALTER TABLE `kerdesek`
  MODIFY `kerdesek_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=502;

--
-- AUTO_INCREMENT a táblához `nehezseg`
--
ALTER TABLE `nehezseg`
  MODIFY `nehezseg_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `nyeremeny`
--
ALTER TABLE `nyeremeny`
  MODIFY `nyeremeny_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `eredmenyek`
--
ALTER TABLE `eredmenyek`
  ADD CONSTRAINT `eredmenyek_ibfk_1` FOREIGN KEY (`Eredmenyek_jatekos`) REFERENCES `jatekos` (`jatekos_id`),
  ADD CONSTRAINT `eredmenyek_ibfk_2` FOREIGN KEY (`Eredmenyek_kategoria`) REFERENCES `kategoria` (`kategoria_id`);

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
