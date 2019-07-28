import express from 'express'
const router = express.Router({ mergeParams: true })

import { isLoggedIn, checkCommentOwnership } from '../middleware/index'

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
            Comment.create(req.body.comment, (err, comment) => {
                err ? console.log(err)
                :
                //add username to comment
                comment.author.id = req.user._id
                comment.author.username = req.user.username
                //save comment
                comment.save()
                campground.comments.push(comment)
                campground.save()
                req.flash('success', 'Comment added')
                res.redirect('/campgrounds/' + campground._id)
            })
    })
})

//EDIT - show form
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found')
            return res.redirect('back')
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            res.render('./comments/edit', { campground_id: req.params.id ,comment: foundComment })
        })
    })
})

//UPDATE - edit comment
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        err ? res.redirect('back')
        :
        req.flash('success', 'Comment updated')
        res.redirect('/campgrounds/' + req.params.id)
    })
})

//DELETE
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        req.flash('success', 'Comment deleted')
        res.redirect('back')
    })
})

export default router