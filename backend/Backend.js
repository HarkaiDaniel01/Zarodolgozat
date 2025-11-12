const express = require('express')
const mysql = require('mysql')
const {body,param,validationResult}=require('express-validator')
const cors = require('cors')
const app = express()
const port = 3000

//Konnyu kerdes=111db  Kozepes=132db  Nehez=57db kerdes van az adatbazisban az 500 bol
//1-80 ,2-86 ,3-74 ,4-84 ,5-76
app.use(express.json())

const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'zarodolgozat'
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

//kategóriák lekérdezése
app.get('/kategoria', (req, res) => {
        const sql=`SELECT kategoria_nev from kategoria`
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

//






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})