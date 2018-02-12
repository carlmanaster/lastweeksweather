const https = require('https')
const express = require('express')

const { PORT, DARK_SKY_API_KEY } = process.env

const CARL = {
  latitude: 32.837453,
  longitude: -117.220324,
}

const MS_PER_SECOND = 1e3
const SECONDS_PER_DAY = 24 * 60 * 60

const start = () => {
  const app = express()
  app.get('/', (req, res) => res.send(`Last Week's Weather`))
  const credits = `<html><body><a href="https://darksky.net/poweredby/">Powered by Dark Sky</a></body></html>`
  app.get('/credits', (req, res) => res.send(credits))
  app.get('/carl', async (req, res) => {
    const weather = await weatherFor(CARL)
    res.send(weather)
  })
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
}

const weatherFor = async location => {
  const { latitude, longitude } = location
  const time = Math.floor(new Date() / MS_PER_SECOND) - 7 * SECONDS_PER_DAY
  const url = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${latitude},${longitude},${time}`

  https
    .get(url, resp => {
      let data = ''

      resp.on('data', chunk => {
        data += chunk
      })

      resp.on('end', () => {
        console.log(`url:`, url)
        console.log(`data:`, data)
      })
    })

    .on('error', err => {
      console.log(`url:`, url)
      console.log('Error: ' + err.message)
    })
}

start()

module.exports = {
  start,
  weatherFor,
}
