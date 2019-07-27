import Campground from '../views/models/campground'
import Comment from '../views/models/comment'

//middleware - check if user is loggedin 
export function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

export function checkCommentOwnership(req, res, next) {
    //check if user is logged in
    if (req.isAuthenticated()) {
        //search for the selected comment
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back')
            } else {
                //check if the actual user id match to the comment author id
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        res.redirect('back')
    }
}

export function checkCampOwnership(req, res, next) {
    //check if user is logged in
    if (req.isAuthenticated()) {
        //search for the selected campground
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect('back')
            } else {
                //check if the actual user id match to the campground author id
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        res.redirect('back')
    }
}