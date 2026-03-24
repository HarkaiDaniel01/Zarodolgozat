const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { body, param, validationResult } = require("express-validator");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "zarodolgozat_kvizjatek",
});

function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

//==========Kategoria felület végpontjai==========
router.put("/:kategoria_id",
  body("kategoria_nev")
    .isLength({ min: 1 })
    .withMessage("A kategória név megadása kötelező!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { kategoria_id } = req.params;
    const { kategoria_nev } = req.body;
    console.log("Módosítás:", { kategoria_nev, kategoria_id });
    const sql = `UPDATE kategoria SET kategoria_nev = ? WHERE kategoria_id = ?`;
    pool.query(sql, [kategoria_nev, kategoria_id], (err) => {
      if (err) {
        console.error("Adatbázis hiba:", err);
        return res.status(500).json({ error: "Adatbázis hiba történt." });
      }
      return res.status(200).json({ message: "Sikeres módosítás! 😊" });
    });
  }
);

router.post("/",
  body("kategoria_nev")
    .isLength({ min: 1 })
    .withMessage("A kategória név megadása kötelező!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { kategoria_nev } = req.body;
    console.log("Feltölt:", { kategoria_nev });
    const checkSql = `SELECT * FROM kategoria WHERE kategoria_nev = ?`;
    pool.query(checkSql, [kategoria_nev], (err, result) => {
      if (err) {
        console.error("Adatbázis hiba:", err);
        return res.status(500).json({ error: "Adatbázis hiba történt." });
      }
      if (result.length > 0) {
        return res.status(409).json({ error: "Ez a kategória már létezik!" });
      }
      const sql = `insert into kategoria values (null,?)`;
      pool.query(sql, [kategoria_nev], (err) => {
        if (err) {
          console.error("Adatbázis hiba:", err);
          return res.status(500).json({ error: "Adatbázis hiba történt." });
        }
        return res.status(201).json({ message: "Sikeres Feltöltés! 😊" });
      });
    });
  }
);

router.delete("/:kategoria_id",
  param("kategoria_id")
    .isLength({ min: 1 })
    .withMessage("A kategória id megadása kötelező!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { kategoria_id } = req.params;
    console.log("Töröl:", { kategoria_id });
    pool.query(`DELETE FROM eredmenyek WHERE Eredmenyek_kategoria = ?`, [kategoria_id], (err) => {
      if (err) {
        console.error("Adatbázis hiba (eredmenyek törlés):", err);
        return res.status(500).json({ error: "Adatbázis hiba történt." });
      }
      pool.query(`DELETE FROM kerdesek WHERE kerdesek_kategoria = ?`, [kategoria_id], (err) => {
        if (err) {
          console.error("Adatbázis hiba (kerdesek törlés):", err);
          return res.status(500).json({ error: "Adatbázis hiba történt." });
        }
        pool.query(`DELETE FROM kategoria WHERE kategoria_id = ?`, [kategoria_id], (err) => {
          if (err) {
            console.error("Adatbázis hiba (kategória törlés):", err);
            return res.status(500).json({ error: "Adatbázis hiba történt." });
          }
          return res.status(200).json({ message: "Sikeres Törlés! ☠️" });
        });
      });
    });
  }
);

module.exports = router;