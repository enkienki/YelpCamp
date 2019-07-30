//DOTENV
require('dotenv').config()
// Node.js body parsing middleware
import bodyParser from'body-parser'
// Mongoose
import mongoose from 'mongoose'
const dbRoute = `mongodb+srv://enkienki:${process.env.MONGODB_PASS}@cluster0-wluuq.mongodb.net/yelpCamp?retryWrites=true&w=majority`
// Express
import express from 'express'
const app = express(),
port = process.env.PORT

import methodOverride from 'method-override'

import flash from 'connect-flash'

import passport from 'passport'
import localStrategy from 'passport-local'
import passportLocalMongoose from 'passport-local-mongoose'

//=============================
// Seeding the DataBase with "fake camps" and "fake comments"
import SeedDB from './seeds'
//SeedDB()

import campgroundRoutes from './routes/campgrounds'
import commentsRoutes from './routes/comments'
import authRoutes from './routes/auth'

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

app.use(methodOverride('_method'))

app.use(flash())

// save the username of user in currentUser to display targeted content and add it as a middleware in every routes
app.use((req, res, next) =>{
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use(authRoutes)
app.use('/campgrounds/:id/comments', commentsRoutes)
app.use('/campgrounds', campgroundRoutes)

//================================
//MODELS
import user from './views/models/user';

//================================
app.listen(port, () => console.log(`Express listen on ${port}`))