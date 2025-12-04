const express = require("express");
const mysql = require("mysql");
const { body, param, validationResult } = require("express-validator");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/kepek", express.static("kepek"));

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
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Dani végpontjai
//kategóriák lekérdezése
app.get('/kategoria', (req, res) => {
        const sql=`SELECT kategoria_id, kategoria_nev from kategoria`
        pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

    return res.status(200).json(result);
  });
});

//Kérdések lekérése kategória és könnyű nehézségi szint szerint
app.post("/kerdesekKonnyu", (req, res) => {
  const { kategoria } = req.body;
  const sql = `
                SELECT * 
                from kerdesek
                where kerdesek_kategoria = ? 
                AND kerdesek_nehezseg = 1 
                ORDER BY rand()
                LIMIT 3`;
  pool.query(sql, [kategoria], (err, result) => {
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

//Kérdések lekérése kategória és közepes nehézségi szint szerint
app.post("/kerdesekKozepes", (req, res) => {
  const { kategoria } = req.body;
  const sql = `
                SELECT * 
                from kerdesek
                where kerdesek_kategoria = ? 
                AND kerdesek_nehezseg = 2 
                ORDER BY rand()
                LIMIT 3`;
  pool.query(sql, [kategoria], (err, result) => {
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

//Kérdések lekérése kategória és nehéz nehézségi szint szerint
app.post("/kerdesekNehez", (req, res) => {
  const { kategoria } = req.body;
  const sql = `
                SELECT * 
                from kerdesek
                where kerdesek_kategoria = ? 
                AND kerdesek_nehezseg = 3 
                ORDER BY rand()
                LIMIT 4`;
  pool.query(sql, [kategoria], (err, result) => {
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

//könnyű kérdések vegyes kategória
app.get("/kerdesekKonnyuVegyes", (req, res) => {
  const sql = `SELECT * 
                from kerdesek
                where kerdesek_nehezseg = 1 
                ORDER BY rand()
                LIMIT 3`;
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

//közepes kérdések vegyes kategória
app.get("/kerdesekKozepesVegyes", (req, res) => {
  const sql = `SELECT * 
                from kerdesek
                where kerdesek_nehezseg = 2 
                ORDER BY rand()
                LIMIT 3`;
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

//közepes kérdések vegyes kategória
app.get("/kerdesekNehezVegyes", (req, res) => {
  const sql = `SELECT * 
                from kerdesek
                where kerdesek_nehezseg = 3 
                ORDER BY rand()
                LIMIT 4`;
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

//Gergő végpontjai  
//=========Admin végpontjai===========
const Admin = require('./Admin');
app.use('/admin', Admin);
//=========Kategória végpontjai===========
const Kategoria = require('./Kategoria');
app.use('/kategoriaModositasa', Kategoria);
app.use('/kategoriaFeltoltes', Kategoria);
app.use('/kategoriaTorles', Kategoria);
//=========Kérdés végpontjai===========
const Kerdes = require('./Kerdes');
app.use('/kerdesModositasa', Kerdes);
app.use('/kerdesFeltoltes', Kerdes);
app.use('/kerdesTorles', Kerdes);
app.use('/kerdes', Kerdes);
//=========Jatekos végpontok===========
const Jatekos = require('./Jatekos');
app.use('/jatekos', Jatekos);
app.use('/ujJatekos', Jatekos);
//=========Keresés kategória és nehézség alapján===========
app.get("/nehezseg", (req, res) => {
  const sql = `SELECT * FROM nehezseg`;
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
// 1. kategoria vegpontbol kapja
// 2. Kérdések szűrése kategória és nehézség alapján
app.post("/kerdesekkeres", (req, res) => {
  const { kategoria_nev, nehezseg_szint } = req.body;

  let sql = `
    SELECT kerdesek_id, kerdesek_kerdes, kerdesek_helyesValasz,
           kerdesek_helytelenValasz1, kerdesek_helytelenValasz2,
           kerdesek_helytelenValasz3, kategoria_nev,
           kerdesek_leiras, nehezseg_szint
    FROM kerdesek
    INNER JOIN kategoria ON kerdesek_kategoria = kategoria_id
    INNER JOIN nehezseg ON kerdesek_nehezseg = nehezseg_id
    WHERE 1=1
  `;

  const params = [];
  if (kategoria_nev) {
    sql += " AND kategoria_nev = ?";
    params.push(kategoria_nev);
  }
  if (nehezseg_szint) {
    sql += " AND nehezseg_szint = ?";
    params.push(nehezseg_szint);
  }

  pool.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: "Adatbázis hiba történt." });
    return res.status(200).json(result);
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
