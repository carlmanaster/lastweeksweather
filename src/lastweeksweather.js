const express = require('express')
const app = express()

const { PORT } = process.env

app.get('/', (req, res) => res.send(`Last Week's Weather`))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
