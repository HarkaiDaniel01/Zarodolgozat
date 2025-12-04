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

//==========Kérdés felület végpontjai==========
//kerdes feltolt
router.post("/",
  body("kerdesek_kerdes").isLength({ min: 1 }).withMessage("A kérdés megadása kötelező!"),
  body("kerdesek_helyesValasz").isLength({ min: 1 }).withMessage("A helyes válasz megadása kötelező!"),
  body("kerdesek_helytelenValasz1").isLength({ min: 1 }).withMessage("A helytelen 1 válasz megadása kötelező!"),
  body("kerdesek_helytelenValasz2").isLength({ min: 1 }).withMessage("A helytelen 2 válasz megadása kötelező!"),
  body("kerdesek_helytelenValasz3").isLength({ min: 1 }).withMessage("A helytelen 3 válasz megadása kötelező!"),
  body("kerdesek_kategoria").isLength({ min: 1 }).withMessage("A kategoria megadása kötelező!"),
  body("kerdesek_leiras").isLength({ min: 1 }).withMessage("A leirás megadása kötelező!"),
  body("kerdesek_nehezseg").isLength({ min: 1 }).withMessage("A nehézzség megadása kötelező!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const {
      kerdesek_kerdes,
      kerdesek_helyesValasz,
      kerdesek_helytelenValasz1,
      kerdesek_helytelenValasz2,
      kerdesek_helytelenValasz3,
      kerdesek_kategoria,
      kerdesek_leiras,
      kerdesek_nehezseg,
    } = req.body;
    console.log("Feltölt:", {
      kerdesek_kerdes,
      kerdesek_helyesValasz,
      kerdesek_helytelenValasz1,
      kerdesek_helytelenValasz2,
      kerdesek_helytelenValasz3,
      kerdesek_kategoria,
      kerdesek_leiras,
      kerdesek_nehezseg,
    });
    const sql = `insert into kerdesek values (null,?,?,?,?,?,?,?,?)`;
    pool.query(
      sql,
      [
        kerdesek_kerdes,
        kerdesek_helyesValasz,
        kerdesek_helytelenValasz1,
        kerdesek_helytelenValasz2,
        kerdesek_helytelenValasz3,
        kerdesek_kategoria,
        kerdesek_leiras,
        kerdesek_nehezseg,
      ],
      (err) => {
        if (err) {
          console.error("Adatbázis hiba:", err);
          return res.status(500).json({ error: "Adatbázis hiba történt." });
        }
        return res.status(200).json({ message: "Sikeres Feltöltés! 😊" });
      }
    );
  }
);

//kerdes torol
router.delete("/:kerdesek_id",
  param("kerdesek_id").isLength({ min: 1 }).withMessage("A kérdés id megadása kötelező!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { kerdesek_id } = req.params;
    console.log("Töröl:", { kerdesek_id });
    const sql = `delete from kerdesek where kerdesek_id=?;`;
    pool.query(sql, [kerdesek_id], (err) => {
      if (err) {
        console.error("Adatbázis hiba:", err);
        return res.status(500).json({ error: "Adatbázis hiba történt." });
      }
      return res.status(200).json({ message: "Sikeres Törlés! ☠️" });
    });
  }
);

//kerdesmodosit
router.put("/:kerdesek_id",
  param("kerdesek_id").isLength({ min: 1 }).withMessage("A kérdés id megadása kötelező!"),
  (req, res) => {
    const { kerdesek_id } = req.params;
    const {
      kerdesek_kerdes,
      kerdesek_helyesValasz,
      kerdesek_helytelenValasz1,
      kerdesek_helytelenValasz2,
      kerdesek_helytelenValasz3,
      kerdesek_kategoria,
      kerdesek_leiras,
      kerdesek_nehezseg,
    } = req.body;

    const sql = `
            UPDATE kerdesek 
            SET kerdesek_kerdes = ?, kerdesek_helyesValasz = ?, kerdesek_helytelenValasz1 = ?, kerdesek_helytelenValasz2 = ?, kerdesek_helytelenValasz3 = ?, kerdesek_kategoria = ?, kerdesek_leiras = ?, kerdesek_nehezseg = ?
            WHERE kerdesek_id = ?`;

    console.log("Modosit:", {
      kerdesek_id,
      kerdesek_kerdes,
      kerdesek_helyesValasz,
      kerdesek_helytelenValasz1,
      kerdesek_helytelenValasz2,
      kerdesek_helytelenValasz3,
      kerdesek_kategoria,
      kerdesek_leiras,
      kerdesek_nehezseg,
    });

    pool.query(
      sql,
      [
        kerdesek_kerdes,
        kerdesek_helyesValasz,
        kerdesek_helytelenValasz1,
        kerdesek_helytelenValasz2,
        kerdesek_helytelenValasz3,
        kerdesek_kategoria,
        kerdesek_leiras,
        kerdesek_nehezseg,
        kerdesek_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Hiba" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Nincs adat" });
        }
        return res.status(200).json({ message: "Sikeres Módosítás! ☠️" });
      }
    );
  }
);

//kerdeslekerdez
router.get("/", (req, res) => {
  const sql = `SELECT kerdesek_id, kerdesek_kerdes, kerdesek_helyesValasz,
                      kerdesek_helytelenValasz1, kerdesek_helytelenValasz2,
                      kerdesek_helytelenValasz3, kategoria_nev,
                      kerdesek_leiras,nehezseg_szint
               FROM kerdesek
               INNER JOIN kategoria ON kerdesek_kategoria=kategoria_id
               INNER JOIN nehezseg ON kerdesek_nehezseg=nehezseg_id
               Order by kategoria_nev`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Hiba" });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Nincs adat" });
    }
    return res.status(200).json(result);
  });
});

module.exports = router;