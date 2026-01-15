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

//eredmények lekérése
app.post("/eredmenyek", (req, res) => {
  const {jatekosId} = req.body;

  const sql = `
                SELECT Eredmenyek_id, jatekos_nev, Eredmenyek_datum, kategoria_nev, Eredmenyek_pont  
                FROM eredmenyek 
                INNER JOIN jatekos ON jatekos_id = Eredmenyek_jatekos 
                INNER JOIN kategoria ON Eredmenyek_kategoria = kategoria_id
                where Eredmenyek_jatekos = ?
                ORDER BY Eredmenyek_datum DESC
              `;

  pool.query(sql, [jatekosId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Hiba" });
    }

    return res.status(200).json(result);
  });
});

app.post("/osszesNyeremeny", (req, res) => {
  const {jatekosId} = req.body;

  const sql = `
                SELECT SUM(Eredmenyek_pont) AS ossz
                FROM eredmenyek
                where Eredmenyek_jatekos = ?
              `;

  pool.query(sql, [jatekosId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Hiba" });
    }

    return res.status(200).json(result);
  });
});

//eredmények törlése
app.delete('/eredmenyTorles/:eredmenyek_id', (req, res) => {
        const {eredmenyek_id} =req.params
        const sql=`delete from eredmenyek where Eredmenyek_id=?`
        pool.query(sql,[eredmenyek_id], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
       
        return res.status(200).json({message:"Sikeres törlés"})
        })
})

//Játékos nevének lekérése
app.post("/jatekos", (req, res) => {
  const {jatekosId} = req.body;
  
  const sql = `
                SELECT jatekos_nev 
                FROM jatekos 
                where jatekos_id = ? LIMIT 1
              `;

  pool.query(sql, [jatekosId], (err, result) => {
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

//eredmény felvitele
app.post('/eredmenyFelvitel', (req, res) => {

        if (handleValidationErrors(req,res)) return 

        const {nyeremeny, jatekos, kategoria} =req.body
        const datumValue = new Date();
        const sql=`insert into eredmenyek values (null,?,?,?,?)`
        pool.query(sql,[nyeremeny, jatekos, datumValue, kategoria], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        
        return res.status(200).json({message:"Sikeres felvitel"})
        })
})

//nehéz kérdések
app.get("/nehezVegyes", (req, res) => {
  const sql = `SELECT * 
                from kerdesek
                where kerdesek_nehezseg = 3 
                ORDER BY rand()
                LIMIT 10`;
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

//Összes játékos rekordja
app.get("/rekordok", (req, res) => {
  const sql = `SELECT jatekos_id, jatekos_nev, SUM(Eredmenyek_pont) AS eredmeny FROM eredmenyek INNER JOIN jatekos On Eredmenyek_jatekos = jatekos_id GROUP BY jatekos_nev ORDER BY eredmeny DESC;`;
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

//Eredmények naponként
app.post("/eredmenyekNaponkent", (req, res) => {
  const {jatekosId} = req.body;

  const sql = `
                SELECT Date(Eredmenyek_datum) AS nap, SUM(Eredmenyek_pont) As eredmeny 
                FROM eredmenyek 
                WHERE Eredmenyek_jatekos = ? 
                GROUP BY nap;
              `;

  pool.query(sql, [jatekosId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Hiba" });
    }

    return res.status(200).json(result);
  });
});

//eredmények kategóriánként
app.post("/eredmenyekKategoriankent", (req, res) => {
  const {jatekosId, kategoriaId} = req.body;

  const sql = `
                SELECT Eredmenyek_pont
                FROM eredmenyek 
                WHERE Eredmenyek_jatekos = ? AND Eredmenyek_kategoria = ?
                GROUP BY Eredmenyek_id;
              `;

  pool.query(sql, [jatekosId, kategoriaId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Hiba" });
    }

    return res.status(200).json(result);
  });
});



//Gergő végpontjai----------------------------------------------------------------------------------------------------------------------------------------  
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
