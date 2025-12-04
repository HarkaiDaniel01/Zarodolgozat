const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key_here_change_in_production';

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

//==========Admin felület végpontjai==========
//Bejelentkezés
router.post('/bejelentkezes',
  body("jatekos_jelszo").isLength({ min: 1 }).withMessage("A jelszó megadása kötelező!"),
  body("jatekos_nev").isLength({ min: 1 }).withMessage("A Felhasználónév megadása kötelező!"),
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_jelszo, jatekos_nev } = req.body;
    console.log("Bejelentkezés:", { jatekos_nev });
    
    const sql = `SELECT * FROM jatekos WHERE jatekos_nev = ?`;
    pool.query(sql, [jatekos_nev], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba" });
      }
      if (result.length === 0) {
        return res.status(401).json({ error: "Hibás jelszó vagy felhasználónév!" });
      }
      
      // Jelszó összehasonlítása bcrypt-tel
      const user = result[0];
      const passwordMatch = await bcrypt.compare(jatekos_jelszo, user.jatekos_jelszo);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: "Hibás jelszó vagy felhasználónév!" });
      }
      
      // JWT token generálása
      const token = jwt.sign(
        { id: user.jatekos_id, username: user.jatekos_nev },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.status(200).json({ 
        message: `Sikeres bejelentkezés! ${jatekos_nev}`,
        token: token,
        user: { id: user.jatekos_id, username: user.jatekos_nev }
      });
    });
  }
);

//Regisztráció
router.post('/regisztracio',
  body("jatekos_jelszo").isLength({ min: 4 }).withMessage("A jelszónak legalább 4 karakter hosszúnak kell lennie!"),
  body("jatekos_nev").isLength({ min: 1 }).withMessage("A Felhasználónév megadása kötelező!"),
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_nev, jatekos_jelszo } = req.body;
    console.log("Regisztráció:", { jatekos_nev });
    
    const checkSql = `SELECT * FROM jatekos WHERE jatekos_nev = ?`;
    pool.query(checkSql, [jatekos_nev], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba" });
      }
      if (result.length > 0) {
        return res.status(409).json({ error: "Ez a felhasználónév már létezik!" });
      }
      
      // Jelszó hashelése bcrypt-tel
      const hashedPassword = await bcrypt.hash(jatekos_jelszo, 10);
      
      const sql = `INSERT INTO jatekos (jatekos_nev, jatekos_jelszo) VALUES (?, ?)`;
      pool.query(sql, [jatekos_nev, hashedPassword], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Hiba" });
        }
        return res.status(201).json({ message: "Sikeres regisztráció! 😊" });
      });
    });
  }
);

module.exports = router;