const express = require('express')

const { PORT, DARK_SKY_API_KEY } = process.env

const CARL = {
  latitude: 32.837453,
  longitude: -117.220324,
}

const start = () => {
  const app = express()
  app.get('/', (req, res) => res.send(`Last Week's Weather`))
  const credits = `<html><body><a href="https://darksky.net/poweredby/">Powered by Dark Sky</a></body></html>`
  app.get('/credits', (req, res) => res.send(credits))
  app.get('/carl', (req, res) => res.send(weatherFor(CARL)))
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
}

const weatherFor = async location => {
  const { latitude, longitude } = location
}

start()

module.exports = {
  start,
  weatherFor,
}
