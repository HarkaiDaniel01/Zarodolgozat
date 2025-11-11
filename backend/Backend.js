const express = require('express')
const mysql = require('mysql')
const {body,param,validationResult}=require('express-validator')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
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



    

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})