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
//==========Játékos felület végpontjai==========
//uj jatekos
router.post("/",
  body("jatekos_nev")
    .isLength({ min: 1 })
    .withMessage("A játékos név megadása kötelező!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_nev } = req.body;
    console.log("Játékos:", { jatekos_nev });
    const sql = `INSERT INTO jatekos (jatekos_nev) VALUES (?)`;
    pool.query(sql, [jatekos_nev], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba" });
      }
      return res.status(201).json({ message: "Sikeres játékot! :) " });
    });
  }
);
//jatekos lekerdez
router.get("/", (req, res) => {
  const sql = `SELECT * from jatekos`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Hiba" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Nincs adat" });
    }

    return res.status(200).json(result);
  });
});

module.exports = router;