const request = require('request')

const appid = '75dc6430c7d208671484eb6862f9069f'
const baseurl = 'https://api.openweathermap.org/data/2.5/'
const weatherurl = new URL('weather', baseurl)
const oneurl = new URL('onecall', baseurl)

const alltypes = ['current', 'minutely', 'hourly', 'daily']
const maptypes = {
    C: 'current',
    M: 'minutely',
    H: 'hourly',
    D: 'daily',
}

const INFO_ERR = "Information Unavailable!"

//returns basic info about city
function geocoding(city, callback) {
    const params = new URLSearchParams({ q: city, appid, units: 'metric' })
    const url = weatherurl + '?' + params
    request({ url, json: true }, (err, res) => {
        if (err) return callback(err)
        if (res.body.cod !== '200' && res.body.cod !== 200) {
            return callback(INFO_ERR)
        }
        const essential = ['coord', 'weather', 'main', 'dt']
        let good = true
        for (const e of essential) {
            if (!(e in res.body)) {
                good = good && false
            }
        }
        if (good) callback(null, res.body)
        else callback(INFO_ERR)
    })
}

function forecast(lat, lon, callback, ...types) {
    const params = new URLSearchParams({
        lat,
        lon,
        exclude: alltypes.filter((v) => !types.includes(v)).join(),
        appid,
        units: 'metric',
    })
    const url = oneurl + '?' + params
    request({ url, json: true }, (err, res) => {
        if (err) callback(err)
        else callback(null, res.body)
    })
}

/*
forecast(
    33.44,
    -94.04,
    (err, res) => console.log(err, res),
    'current',
    'hourly'
)
*/

exports.module = { geocoding, forecast, alltypes, maptypes }
