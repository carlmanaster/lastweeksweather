const https = require('https')
const express = require('express')

const { PORT, DARK_SKY_API_KEY } = process.env

const CARL = {
  latitude: 32.837453,
  longitude: -117.220324,
}

const WEEKDAYS = [
  `Sunday`,
  `Monday`,
  `Tuesday`,
  `Wednesday`,
  `Thursday`,
  `Friday`,
  `Saturday`,
]

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

const oneDaysWeather = async (latitude, longitude, time) => {
  const url = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${latitude},${longitude},${time}?exclude=currently,minutely,hourly,alerts,flags`

  return new Promise(resolve => {
    try {
      https
        .get(url, resp => {
          let data = ''

          resp.on('data', chunk => {
            data += chunk
          })

          resp.on('end', () => {
            resolve(data)
          })
        })

        .on('error', err => {
          resolve(undefined)
        })
    } catch (e) {
      resolve(undefined)
    }
  })
}

const usefulBits = json => {
  const { time, summary, temperatureLow, temperatureHigh } = json.daily.data[0]
  return { time, summary, temperatureLow, temperatureHigh }
}

const tableRow = r => {
  const day = WEEKDAYS[new Date(r.time * 1e3).getDay()]
  const low = Math.round(r.temperatureLow)
  const high = Math.round(r.temperatureHigh)
  return `<tr><td>${day}</td><td>${low}-${high}</td><td>${r.summary}</td></tr>`
}

const weatherFor = async location => {
  const { latitude, longitude } = location
  const tableHead = `<tr><th>Day</th><th>Temperatures</th><th>Summary</th></tr>`
  let result = `<html><body><table>${tableHead}`

  for (let i = 7; i > 0; i--) {
    const time = Math.floor(new Date() / MS_PER_SECOND) - i * SECONDS_PER_DAY
    const data = await oneDaysWeather(latitude, longitude, time)
    result += tableRow(usefulBits(JSON.parse(data))) + '\n'
  }

  result += `</table></body></html>`
  return result
}

start()

module.exports = {
  start,
  weatherFor,
}
