import express from 'express'
const router = express.Router()

import { isLoggedIn, checkCampOwnership } from '../middleware/index'

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

import Campground from '../views/models/campground'
import Comment from '../views/models/comment'


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
router.get('/new', isLoggedIn, (req, res) => {
    res.render('./campgrounds/new')})

// CREATE - add new campground to the DB coming from the form
router.post('/', (req, res) => {
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create({
        name: req.body.newCampName,
        image: req.body.newCampImage,
        price: req.body.newCampPrice,
        description: req.body.newCampDescription,
        author: author
    },(err, campground) => { 
        err && console.log(err) 
        })
    res.redirect('/campgrounds')
})

// SHOW - show infos about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            console.log(err)
            req.flash('error', 'Campground not found')
            res.redirect('back')
        } else {
            res.render('./campgrounds/show', { campground: foundCampground, currentDay: currentDay})
        }
    })
})

//EDIT - show form to update a campground
router.get('/:id/edit', checkCampOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('./campgrounds/edit', { campground: foundCampground })
    })
})

//UPDATE - update a campground
router.put('/:id', checkCampOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, editedCamp) => {
        err ? console.log(err) 
        :
        console.log(req.body.campground);
        res.redirect('/campgrounds/' + req.params.id)
    })
})

//DELETE - delete a campground
router.delete('/:id',checkCampOwnership , (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, removedCamp) => {
        err ? console.log(err)
        :
        req.flash('success', 'Campground deleted')
        Comment.deleteMany({_id: {$in: removedCamp.comments}}, (err) => {
            err && console.log(err);  
        })
    })
    res.redirect('/campgrounds')
})

//current DATE - used to display comments
const currentDay = Date.now()

export default router