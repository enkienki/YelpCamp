// Express
const express = require('express')
const app = express()
port = 3000

// Mongoose
var mongoose = require('mongoose')
const dbRoute = 'mongodb+srv://enkienki:Rmn2010%2a@cluster0-wluuq.mongodb.net/yelpCamp?retryWrites=true&w=majority'
mongoose.connect(dbRoute, { useNewUrlParser: true })
let db = mongoose.connection
db.once('open', () => console.log('connected to database'))

// A light-weight module that brings window.fetch to Node.js
const fetch = require('node-fetch')

// Node.js body parsing middleware
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// used to route the app.css to public folder
app.use(express.static('public'))

// allow to not use the extension .ejs after file names
app.set('view engine', 'ejs')

/* var campgrounds = [
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
] */

// Set Campground Model
var CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
})
var Campground = mongoose.model('Campground', CampgroundSchema)

// Route to homepage
app.get('/', (req, res) => res.render('home'))

// Route to Campgrounds page
app.get('/campgrounds', (req, res) => {
    //retrive existing campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        err ? 
        console.log(err)
        : 
        //display campgrounds from DB
        res.render('campgrounds', { campgrounds: campgrounds })   
    })   
})

app.get('/new', (req, res) => res.render('new'))

// add new campground to the DB coming from the form
app.post('/addNewCamp', (req, res) => {
    Campground.create({
        name : req.body.newCampName,
        image: req.body.newCampImage,
    },
        (err, camp) => { err ? console.log(err) : console.log(camp) })
    res.redirect('/campgrounds')
})


app.listen(port, () => console.log(`Express listen on ${port}`))