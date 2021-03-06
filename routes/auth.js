import express from 'express'
const router = express.Router()

import passport from 'passport'
import user from '../views/models/user'

// Root route
router.get('/', (req, res) => res.render('./campgrounds/home'))


//================================
//AUTH ROUTES

//REGISTER
//NEW - show registration form
router.get('/register', (req, res) => {
    res.render('register')
})
//CREATE - register user to DB
router.post('/register', (req, res) => {
    const newUser = new user({ username: req.body.username })
    user.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render('register', { 'error': err.message })
        }
        passport.authenticate('local')(req, res, function () {
            req.flash("success", "Successfully registered, welcome to YelpCamp " + user.username)
            res.redirect('/campgrounds')
        })
    })
})

//LOGIN
//NEW - Show login form
router.get('/login', (req, res) => {
    res.render('login')
})
//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

//LOGOUT
router.get('/logout', (req, res) => {
    req.flash("success", "Successfully logged out")
    req.logout()
    res.redirect('/campgrounds')
})

export default router