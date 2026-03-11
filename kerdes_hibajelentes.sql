-- Hibajelentés tábla (teljes újra létrehozás)
DROP TABLE IF EXISTS `kerdes_hibajelentes`;

CREATE TABLE `kerdes_hibajelentes` (
  `hibajelentes_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `hibajelentes_kerdes_id` INT NOT NULL,
  `hibajelentes_jatekos_id` INT,
  `hibajelentes_leiras` TEXT NOT NULL,
  `hibajelentes_datum` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `hibajelentes_status` VARCHAR(50) DEFAULT 'új',
  `hibajelentes_admin_megjegyzes` TEXT,
  `hibajelentes_admin_id` INT,
  FOREIGN KEY (`hibajelentes_kerdes_id`) REFERENCES `kerdesek`(`kerdesek_id`),
  FOREIGN KEY (`hibajelentes_jatekos_id`) REFERENCES `jatekos`(`jatekos_id`),
  FOREIGN KEY (`hibajelentes_admin_id`) REFERENCES `jatekos`(`jatekos_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- Insert example
INSERT INTO `kerdes_hibajelentes` (`hibajelentes_kerdes_id`, `hibajelentes_jatekos_id`, `hibajelentes_leiras`, `hibajelentes_status`) 
VALUES (1, 16, 'A helyes válasz hibás', 'új');
