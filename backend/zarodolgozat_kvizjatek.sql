-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2025 at 09:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zarodolgozat_kvizjatek`
--
CREATE DATABASE IF NOT EXISTS `zarodolgozat_kvizjatek` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `zarodolgozat_kvizjatek`;

-- --------------------------------------------------------

--
-- Table structure for table `jatekos`
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
-- Table structure for table `kategoria`
--

CREATE TABLE `kategoria` (
  `kategoria_id` int(11) NOT NULL,
  `kategoria_nev` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kerdesek`
--

CREATE TABLE `kerdesek` (
  `kerdesek_id` int(11) NOT NULL,
  `kerdesek_kerdes` varchar(255) NOT NULL,
  `kerdesek_helyesValasz` varchar(255) NOT NULL,
  `kerdesek_helytelenValasz1` varchar(255) NOT NULL,
  `kerdesek_helytelenValasz2` varchar(255) NOT NULL,
  `kerdesek_helytelenValasz3` varchar(255) NOT NULL,
  `kerdesek_leiras` varchar(255) NOT NULL,
  `kerdesek_kategoria` int(11) NOT NULL,
  `kerdesek_nehezseg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nehezseg`
--

CREATE TABLE `nehezseg` (
  `nehezseg_id` int(11) NOT NULL,
  `nehezseg_szint` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jatekos`
--
ALTER TABLE `jatekos`
  ADD PRIMARY KEY (`jatekos_id`);

--
-- Indexes for table `kategoria`
--
ALTER TABLE `kategoria`
  ADD PRIMARY KEY (`kategoria_id`);

--
-- Indexes for table `kerdesek`
--
ALTER TABLE `kerdesek`
  ADD PRIMARY KEY (`kerdesek_id`);

--
-- Indexes for table `nehezseg`
--
ALTER TABLE `nehezseg`
  ADD PRIMARY KEY (`nehezseg_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jatekos`
--
ALTER TABLE `jatekos`
  MODIFY `jatekos_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategoria`
--
ALTER TABLE `kategoria`
  MODIFY `kategoria_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kerdesek`
--
ALTER TABLE `kerdesek`
  MODIFY `kerdesek_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nehezseg`
--
ALTER TABLE `nehezseg`
  MODIFY `nehezseg_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
