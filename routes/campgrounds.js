import express from 'express'
const router = express.Router()

import Campground from '../views/models/campground'

// INDEX - show all campgrounds
router.get('/', (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => res.render('./campgrounds/new'))

// CREATE - add new campground to the DB coming from the form
router.post('/campgrounds', (req, res) => {
    Campground.create({
        name: req.body.newCampName,
        image: req.body.newCampImage,
        description: req.body.newCampDescription,
    },
        (err, camp) => { err ? console.log(err) : console.log(camp) })
    res.redirect('./campgrounds')
})

// SHOW - show infos about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err)
        } else {
            res.render('./campgrounds/show', { campground: foundCampground, currentDay: currentDay })
        }
    })
})

//middleware - check if user is loggedin before access to secret page
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//current DATE
const currentDay = Date.now()

export default router