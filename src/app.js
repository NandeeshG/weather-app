const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()

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
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        author: 'Nandeesh Gupta',
        helpText: 'Help has arrived!',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About this app',
        author: 'Nandeesh Gupta',
        linkedin: 'nandeeshg',
    })
})

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

app.listen(3000, () => console.log('Started on 3000'))
