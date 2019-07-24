// Node.js body parsing middleware
import bodyParser from'body-parser'
// Mongoose
import mongoose from 'mongoose'
const dbRoute = 'mongodb+srv://enkienki:Rmn2010%2a@cluster0-wluuq.mongodb.net/yelpCamp?retryWrites=true&w=majority'
// Express
import express from 'express'
const app = express(),
port = 3000

import passport from 'passport'
import localStrategy from 'passport-local'
import passportLocalMongoose from 'passport-local-mongoose'

//=============================
// Seeding the DataBase with "fake camps" and "fake comments"
import SeedDB from './seeds'
//SeedDB()

//current DATE
const currentDay = Date.now()

//=============================
// APP CONFIG
// mongoose
mongoose.connect(dbRoute, { useNewUrlParser: true })
let db = mongoose.connection
db.once('open', () => console.log('connected to database'))
// body parser
app.use(bodyParser.urlencoded({ extended: true }))
// used to route the app.css to public folder
app.use(express.static('public'))
// allow to not use the extension .ejs after file names
app.set('view engine', 'ejs')
//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "wathever make you feel ok",
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

// save the username of user in currentUser to display targeted content and add it as a middleware in every routes
app.use((req, res, next) =>{
    res.locals.currentUser = req.user
    next()
})

//================================
//MODELS
import Campground from './views/models/campground'
import Comment from './views/models/comment'
import user from './views/models/user';

//================================
//ROUTES

// Route to homepage
app.get('/', (req, res) => res.render('./campgrounds/home'))

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
    //retrive existing campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        err ? 
        console.log(err)
        : 
        //display campgrounds from DB
            res.render('./campgrounds/index', { campgrounds: campgrounds })   
    })   
})

// NEW - show form to create new campground
app.get('/campgrounds/new', isLoggedIn, (req, res) => res.render('./campgrounds/new'))

// CREATE - add new campground to the DB coming from the form
app.post('/campgrounds', (req, res) => {
    Campground.create({
        name : req.body.newCampName,
        image: req.body.newCampImage,
        description: req.body.newCampDescription,
    },
        (err, camp) => { err ? console.log(err) : console.log(camp) })
    res.redirect('./campgrounds/index')
})

// SHOW - show infos about one campground
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err)
        } else {
            res.render('./campgrounds/show', { campground: foundCampground, currentDay: currentDay })            
        }
    })
})

//================================
// COMMENTS ROUTES
//NEW - show form 
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        err ? console.log(err)
        :
        res.render('./comments/new', { campground: foundCampground })
    })
})
//CREATE - create comment and save it to DB
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        err ? console.log(err)
        :
        Comment.create({
        text: req.body.newText,
        author: req.body.newAuthor,
        }, (err, comment) => { 
            err ? console.log(err) 
            : 
            campground.comments.push(comment)
            campground.save()
            res.redirect('/campgrounds/' + campground._id)
        }) 
    })    
})
//================================
//AUTH ROUTES
//REGISTER
//NEW - show registration form
app.get('/register', (req, res) => {
    res.render('register')
})
//CREATE - register user to DB
app.post('/register', (req, res) => {
    const newUser = new user({username: req.body.username})
    user.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds')
        })
    })
})
//LOGIN
//NEW - Show login form
app.get('/login', (req, res) => {
    res.render('login')
})
//handle login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

//LOGOUT
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/campgrounds')
})

//middleware - check if user is loggedin before access to secret page
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//================================
app.listen(port, () => console.log(`Express listen on ${port}`))