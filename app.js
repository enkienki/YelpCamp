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


// Set Campground Model
var CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
})
var Campground = mongoose.model('Campground', CampgroundSchema)

// Route to homepage
app.get('/', (req, res) => res.render('home'))

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
    //retrive existing campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        err ? 
        console.log(err)
        : 
        //display campgrounds from DB
        res.render('index', { campgrounds: campgrounds })   
    })   
})

// NEW - show form to create new campground
app.get('/new', (req, res) => res.render('new'))

// CREATE - add new campground to the DB coming from the form
app.post('/addNewCamp', (req, res) => {
    Campground.create({
        name : req.body.newCampName,
        image: req.body.newCampImage,
        description: req.body.newCampDescription,
    },
        (err, camp) => { err ? console.log(err) : console.log(camp) })
    res.redirect('/index')
})

// SHOW - show infos about one campground
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err)
        } else {
            res.render('show', { campground: foundCampground })            
        }
    })
})

app.listen(port, () => console.log(`Express listen on ${port}`))