import Campground from '../views/models/campground'
import Comment from '../views/models/comment'

//middleware - check if user is loggedin 
export function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in first')
    res.redirect("/login");
}

export function checkCommentOwnership(req, res, next) {
    //check if user is logged in
    if (req.isAuthenticated()) {
        //search for the selected comment
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash('error', 'Comment not found')
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
    if (req.isAuthenticated()) {
        //search for the selected campground
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found')
                res.redirect('back')
                //check if the actual user id match to the campground author id
            } else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) { 
                req.campground = foundCampground
                next()
            } else {
                req.flash('error', 'You don\'t have permission to do that!');
                res.redirect('/campgrounds/' + req.params.id);
            }
        })
    }
} 

