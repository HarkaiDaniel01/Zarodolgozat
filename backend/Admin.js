const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { body, validationResult, param } = require("express-validator");
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
        { id: user.jatekos_id, username: user.jatekos_nev, admin: user.jatekos_admin },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return res.status(200).json({ 
        message: `Sikeres bejelentkezés! ${jatekos_nev}`,
        token: token,
        jatekos_admin: user.jatekos_admin,
        user: { id: user.jatekos_id, username: user.jatekos_nev, admin: user.jatekos_admin }
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
      
      const sql = `INSERT INTO jatekos (jatekos_nev, jatekos_jelszo, jatekos_admin) VALUES (?, ?, 0)`;
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

// Admin státusz ellenőrzése
router.get('/check-admin/:jatekos_nev', (req, res) => {
  const { jatekos_nev } = req.params;
  
  const sql = `SELECT jatekos_admin FROM jatekos WHERE jatekos_nev = ?`;
  pool.query(sql, [jatekos_nev], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Hiba" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Felhasználó nem található" });
    }
    
    return res.status(200).json({ 
      jatekos_admin: result[0].jatekos_admin 
    });
  });
});

// Admin jog megadása
router.put('/jog-ad/:jatekos_id',
  param("jatekos_id").isInt().withMessage("Érvénytelen játékos ID!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_id } = req.params;
    
    const sql = `UPDATE jatekos SET jatekos_admin = 1 WHERE jatekos_id = ?`;
    pool.query(sql, [jatekos_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba történt az admin jog megadása során" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Felhasználó nem található" });
      }
      return res.status(200).json({ message: "Admin jog sikeresen megadva!" });
    });
  }
);

// Admin jog elvétele
router.put('/jog-elvesz/:jatekos_id',
  param("jatekos_id").isInt().withMessage("Érvénytelen játékos ID!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_id } = req.params;
    
    const sql = `UPDATE jatekos SET jatekos_admin = 0 WHERE jatekos_id = ?`;
    pool.query(sql, [jatekos_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba történt az admin jog elvétele során" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Felhasználó nem található" });
      }
      return res.status(200).json({ message: "Admin jog sikeresen elvéve!" });
    });
  }
);
//Engedelykeres
router.put('/engedelykeres/:jatekos_nev',
  body("jatekos_admin").isIn(['0', '1']).withMessage("Érvénytelen admin státusz!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_nev } = req.params;
    const { jatekos_admin } = req.body;
    console.log("Engedélykérés:", { jatekos_nev, jatekos_admin });
    const sql = `UPDATE jatekos SET jatekos_admin = ? WHERE jatekos_nev = ?`;
    pool.query(sql, [jatekos_admin, jatekos_nev], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Felhasználó nem található" });
      }
      return res.status(200).json({ message: "Sikeres státusz módosítás!" });
    });
  }
);
//Admin panelben valo jatekos lista
router.get('/jatekoslista', (req, res) => {
  const sql = `SELECT jatekos_id, jatekos_nev, jatekos_admin FROM jatekos`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Hiba" });
    }
    if (result.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(result);
  });
});
//jatekos torlese
router.delete('/jatekostorles/:jatekos_id',
  param("jatekos_id").isInt().withMessage("Érvénytelen játékos ID!"),
  (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_id } = req.params;
    console.log("Játékos törlése:", { jatekos_id });
    
    const deleteEredmenyekSql = `DELETE FROM eredmenyek WHERE Eredmenyek_jatekos = ?`;
    pool.query(deleteEredmenyekSql, [jatekos_id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba az eredmények törlésekor" });
      }
      
      const sql = `DELETE FROM jatekos WHERE jatekos_id = ?`;
      pool.query(sql, [jatekos_id], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Hiba" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Felhasználó nem található" });
        }
        return res.status(200).json({ message: "Sikeres törlés!" });
      });
    });
  } 
);
// Saját jelszó módosítása
router.put('/jelszo-modositas',
  body("jatekos_nev").isLength({ min: 1 }).withMessage("A felhasználónév megadása kötelező!"),
  body("regi_jelszo").isLength({ min: 1 }).withMessage("A régi jelszó megadása kötelező!"),
  body("uj_jelszo").isLength({ min: 4 }).withMessage("Az új jelszónak legalább 4 karakter hosszúnak kell lennie!"),
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_nev, regi_jelszo, uj_jelszo } = req.body;
    console.log("Jelszó módosítása:", { jatekos_nev });

    // Felhasználó ellenőrzése és jelenlegi jelszó ellenőrzése
    const sql = `SELECT * FROM jatekos WHERE jatekos_nev = ?`;
    pool.query(sql, [jatekos_nev], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Felhasználó nem található" });
      }

      const user = result[0];
      const passwordMatch = await bcrypt.compare(regi_jelszo, user.jatekos_jelszo);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Hibás jelenlegi jelszó!" });
      }

      // Új jelszó hashelése és mentése
      const hashedPassword = await bcrypt.hash(uj_jelszo, 10);
      const updateSql = `UPDATE jatekos SET jatekos_jelszo = ? WHERE jatekos_nev = ?`;
      pool.query(updateSql, [hashedPassword, jatekos_nev], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Hiba" });
        }
        return res.status(200).json({ message: "Jelszó sikeresen módosítva!" });
      });
    });
  }
);

// Jelszó felülírása ellenőrzés nélkül (admin)
router.put('/jelszo-feluliras/:jatekos_id',
  param("jatekos_id").isInt().withMessage("Érvénytelen játékos ID!"),
  body("uj_jelszo").isLength({ min: 4 }).withMessage("Az új jelszónak legalább 4 karakter hosszúnak kell lennie!"),
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;
    const { jatekos_id } = req.params;
    const { uj_jelszo } = req.body;

    const hashedPassword = await bcrypt.hash(uj_jelszo, 10);
    const sql = `UPDATE jatekos SET jatekos_jelszo = ? WHERE jatekos_id = ?`;
    pool.query(sql, [hashedPassword, jatekos_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Felhasználó nem található" });
      }
      return res.status(200).json({ message: "Jelszó sikeresen felülírva!" });
    });
  }
);

// Saját fiók törlése
router.delete('/sajat-fiok-torles/:jatekos_nev',
  async (req, res) => {
    const { jatekos_nev } = req.params;
    console.log("Saját fiók törlése:", jatekos_nev);

    const sql = `DELETE FROM jatekos WHERE jatekos_nev = ?`;
    pool.query(sql, [jatekos_nev], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Hiba" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Felhasználó nem található" });
      }
      return res.status(200).json({ message: "Fiók sikeresen törölve!" });
    });
  }
);

module.exports = router;