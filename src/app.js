const path = require('path')
const express = require('express')
const hbs = require('hbs')
const weather = require('./weather/weather').module
const weather_utils = require('./weather/utils').module
const { callbackify } = require('util')

const app = express()
const PORT = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars for express
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//use() used to customize the server
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'WeatherApp',
        author: 'Nandeesh Gupta',
        //indexText: 'Enter the name of the city below'
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        author: 'Nandeesh Gupta',
        helpText: 'To use the app, go to home page and enter the city name\'s whose current weather you are looking for. Forecast weather coming soon!',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About the app',
        author: 'Nandeesh Gupta',
        aboutText: 'This app uses OpenWeatherAPI, NodeJS, ExpressJS, Handlebars and HTML,CSS to provide you the current weather details. Made by me in Sep 2021',
        linkedin: 'nandeeshg',
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.city){
        return res.send({
            error:"City not provided!"
        })
    }
    weather.geocoding(req.query.city,(err,data)=>{
        if(err){
            return res.send({
                error:err
            })
        }
        let ret_data ={
            city: data.name,
            longitude: data.coord.lon,
            latitude: data.coord.lat,
            weather_summary: data.weather[0].description,
            weather_main: data.weather[0].main,
            temperature: weather_utils.specialTransform('temp',data.main.temp),
            feels_like: weather_utils.specialTransform('temp',data.main.feels_like),
            humidity: weather_utils.specialTransform('humidity',data.main.humidity),
            visibility: weather_utils.specialTransform('humidity',data.visibility),
            wind_speed: weather_utils.specialTransform('speed',data.wind.speed),
            clouds: weather_utils.specialTransform('clouds',data.clouds.all),
            dt: weather_utils.specialTransform('dt',data.dt),
            sunrise: weather_utils.specialTransform('dt',data.sys.sunrise),
            sunset: weather_utils.specialTransform('dt' ,data.sys.sunset),
            country_code: data.sys.country,
        }
        ret_data.summary = `${ret_data.city} is experiencing ${ret_data.weather_summary||ret_data.weather_main||'the following'}. Temperature is ${ret_data.temperature}, which feels like ${ret_data.feels_like} due to ${ret_data.humidity} Humidity.`
        res.send(ret_data)
    })
})

app.get('/country', (req,res) => {
    // https://restcountries.eu/rest/v2/alpha/BT
    res.send({
        error: "Endpoint coming soon!"
    })
})

app.get('/forecast', (req,res) => {
    if(!req.query.city){
        return res.send({
            error:"City not provided!"
        })
    }
    req.query.type = req.query.type || 'C'

    if (!(req.query.type in weather.maptypes)) {
        return res.send({
            error:"Wrong forecast type!"
        })
    }
    weather.geocoding(req.query.city, (err, resw) => {
        if (err){
            return res.send({error:err})
        }
        else {
            weather.forecast(
                resw.coord.lat,
                resw.coord.lon,
                (err, resw) => {
                    if (err){
                        return res.send({
                            error:err
                        })
                    } 
                    const recursiveTransform = (item,obj) => {
                        if(typeof obj[item] === 'object'){
                            for(let i in obj[item])
                                recursiveTransform(i,obj[item])
                        }
                        else{
                            obj[item] = weather_utils.specialTransform(item,obj[item])
                        }
                    }
                    for(let item in resw){
                        recursiveTransform(item, resw)
                    }
                    return res.send(resw)
                },
                weather.maptypes[req.query.type]
            )
        }
    })
})



//----- 404s 

app.get('/about/*', (req, res) => {
    res.render('404', {
        title: '404!',
        author: 'Nandeesh Gupta',
        desc: 'Nothing more to know about this app :)',
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404!',
        author: 'Nandeesh Gupta',
        desc: 'Help article not found',
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404!',
        author: 'Nandeesh Gupta',
        desc: 'Page not found!',
    })
})

app.listen(PORT, () => console.log(`Started on ${PORT}`))
