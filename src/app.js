const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3002
// accesses the public folder and static assets

// define paths for express config 
const publicPathDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// setup  handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// setup static directory to serve 
app.use(express.static(publicPathDirectory))

// rendering dynamic content
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Alisena Mudaber'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Alisena Mudaber'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'If you need help, send us an email',
        title: 'Help',
        name: 'Alisena Mudaber'
    })
})

// this means whenver someone visits the server,what should happen
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must enter an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})



app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alisena Mudaber',
        errorMessage: 'Help article not found'
    })
})

// when the url is something else
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alisena Mudaber',
        errorMessage: 'Page not found'
    })
})

// app.com
// app.com/help
// app.com/about

// This starts the server
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})