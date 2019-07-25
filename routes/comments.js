import express from 'express'
const router = express.Router({ mergeParams: true })

import Campground from '../views/models/campground'
import Comment from '../views/models/comment'

//================================
// COMMENTS ROUTES
//NEW - show form 
router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        err ? console.log(err)
            :
            res.render('./comments/new', { campground: foundCampground })
    })
})
//CREATE - create comment and save it to DB
router.post('/', isLoggedIn, (req, res) => {
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

//middleware - check if user is loggedin before access to secret page
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

export default router