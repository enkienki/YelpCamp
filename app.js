const express = require('express')
const app = express()
port = 3000
// A light-weight module that brings window.fetch to Node.js
const fetch = require('node-fetch')
// Node.js body parsing middleware
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
// allow to not use the extension .ejs after file names
app.set('view engine', 'ejs')

var campgrounds = [
    {
        name: "Goat Mountain",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
    },
    {
        name: "Goat River",
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
    },
    {
        name: "Lion Hill",
        image: "https://images.unsplash.com/photo-1519395612667-3b754d7b9086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
    },
    {
        name: "Little Valley",
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
    },
    {
        name: "Lion Hill",
        image: "https://images.unsplash.com/photo-1519395612667-3b754d7b9086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
    },
    {
        name: "Goat Mountain",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60",
    },
]

app.get('/', (req, res) => res.render('home'))

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', { campgrounds: campgrounds })
})

app.get('/new', (req, res) => res.render('new'))

app.post('/addNewCamp', (req, res) => {
    const newCamp = {
        name : req.body.newCampName,
        image: req.body.newCampImage,
    }
    campgrounds = [...campgrounds, newCamp]
    res.redirect('/campgrounds')
})


app.listen(port, () => console.log(`Express listen on ${port}`))