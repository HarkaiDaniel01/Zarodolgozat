const express = require('express')
const mysql = require('mysql')
const {body,param,validationResult}=require('express-validator')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use("/kepek",express.static("kepek"))

const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'zarodolgozat_kvizjatek'
        })
function handleValidationErrors(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
}
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Dani végpontjai
//kategóriák lekérdezése
app.get('/kategoria', (req, res) => {
        const sql=`SELECT kategoria_id,kategoria_nev from kategoria`
        pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

        return res.status(200).json(result)
        })
})

//Kérdések lekérése kategória és könnyű nehézségi szint szerint
app.post('/kerdesekKonnyu', (req, res) => {
        const {kategoria} =req.body
        const sql=`
                SELECT * 
                from kerdesek
                where kerdesek_kategoria = ? 
                AND kerdesek_nehezseg = 1 
                ORDER BY rand()
                LIMIT 3`
        pool.query(sql,[kategoria], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

        return res.status(200).json(result)
        })
})

//Kérdések lekérése kategória és közepes nehézségi szint szerint
app.post('/kerdesekKozepes', (req, res) => {
        const {kategoria} =req.body
        const sql=`
                SELECT * 
                from kerdesek
                where kerdesek_kategoria = ? 
                AND kerdesek_nehezseg = 2 
                ORDER BY rand()
                LIMIT 3`
        pool.query(sql,[kategoria], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

        return res.status(200).json(result)
        })
})

//Kérdések lekérése kategória és nehéz nehézségi szint szerint
app.post('/kerdesekNehez', (req, res) => {
        const {kategoria} =req.body
        const sql=`
                SELECT * 
                from kerdesek
                where kerdesek_kategoria = ? 
                AND kerdesek_nehezseg = 3 
                ORDER BY rand()
                LIMIT 4`
        pool.query(sql,[kategoria], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

        return res.status(200).json(result)
        })
})

//könnyű kérdések vegyes kategória
app.get('/kerdesekKonnyuVegyes', (req, res) => {
        const sql=`SELECT * 
                from kerdesek
                where kerdesek_nehezseg = 1 
                ORDER BY rand()
                LIMIT 3`
        pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

        return res.status(200).json(result)
        })
})

//közepes kérdések vegyes kategória
app.get('/kerdesekKozepesVegyes', (req, res) => {
        const sql=`SELECT * 
                from kerdesek
                where kerdesek_nehezseg = 2 
                ORDER BY rand()
                LIMIT 3`
        pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

        return res.status(200).json(result)
        })
})

//közepes kérdések vegyes kategória
app.get('/kerdesekNehezVegyes', (req, res) => {
        const sql=`SELECT * 
                from kerdesek
                where kerdesek_nehezseg = 3 
                ORDER BY rand()
                LIMIT 4`
        pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        if (result.length===0){
            return res.status(404).json({error:"Nincs adat"})
        }

        return res.status(200).json(result)
        })
})

//Gergő végpontjai
//jatekosnev felvitele
//javitas alatt
app.post('/ujJatekos', 
    body('jatekos_nev').isLength({min:1}).withMessage('A játékos név megadása kötelező!'),
    (req, res) => {
        const validationError=handleValidationErrors(req,res)
        if (validationError) return validationError
        const {jatekos_nev} =req.body
        const sql=`INSERT INTO jatekosok (jatekos_nev) VALUES (null,?,"",0,0,)`
        pool.query(sql,[jatekos_nev], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
        return res.status(201).json({message:"Sikeres játékot! :) "})
        })
})
//kategoria modositasa
//UPDATE `kategoria` SET `kategoria_id`='[value-1]',`kategoria_nev`='[value-2]' WHERE 1
app.put('/kategoriaModositasa/:id',
    body('kategoria_nev').isLength({ min: 1 }).withMessage('A kategória név megadása kötelező!'),
    (req, res) => {
        const validationError = handleValidationErrors(req, res);
        if (validationError) return validationError;
        const { id } = req.params;
        const { kategoria_nev } = req.body;
        console.log("Módosítás:", { kategoria_nev, id });
        const sql = `UPDATE kategoria SET kategoria_nev = ? WHERE kategoria_id = ?`;
        pool.query(sql, [kategoria_nev, id], (err) => {
            if (err) {
                console.error('Adatbázis hiba:', err);
                return res.status(500).json({ error: "Adatbázis hiba történt." });
            }
            return res.status(200).json({ message: "Sikeres módosítás! 😊" });
        });
    }
);
app.post('/kategoriaFeltoltes',
    body('kategoria_nev').isLength({ min: 1 }).withMessage('A kategória név megadása kötelező!'),
    (req, res) => {
        const validationError = handleValidationErrors(req, res);
        if (validationError) return validationError;
        const { kategoria_nev} = req.body;
        console.log("Feltölt:", {kategoria_nev});
        const sql = `insert into kategoria values (null,?)`;
        pool.query(sql, [kategoria_nev], (err) => {
            if (err) {
                console.error('Adatbázis hiba:', err);
                return res.status(500).json({ error: "Adatbázis hiba történt." });
            }
            return res.status(200).json({ message: "Sikeres Feltöltés! 😊" });
        });
    }
);
app.delete('/kategoriaTorles/:kategoria_id',
    param('kategoria_id').isLength({ min: 1 }).withMessage('A kategória id megadása kötelező!'),
    (req, res) => {
        const validationError = handleValidationErrors(req, res);
        if (validationError) return validationError;
        const { kategoria_id } = req.params;
        console.log("Töröl:", {kategoria_id});
        const sql = `delete from kategoria where kategoria_id=?`;
        pool.query(sql, [kategoria_id], (err) => {
            if (err) {
                console.error('Adatbázis hiba:', err);
                return res.status(500).json({ error: "Adatbázis hiba történt." });
            }
            return res.status(200).json({ message: "Sikeres Törlés! ☠️" });
        });
    }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})