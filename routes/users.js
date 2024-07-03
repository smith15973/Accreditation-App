const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plant = require('../models/plant')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(catchAsync(async (req, res) => {
        const plants = await Plant.find({});
        res.render('users/register', { plants });
    }))

    .post(catchAsync(async (req, res) => {
        try {
            const { username, password, email, firstName, lastName, plants } = req.body;
            const user = new User({ email, username, firstName, lastName, plants });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'Welcome to the Accredidation App');
                return res.redirect('/');
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('/user/register');
        }

    }));

router.route('/login')
    .get((req, res) => {
        if (res.locals.currentUser) {
            return res.redirect('/')
        }
        res.render('users/login');
    })
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
        req.flash('success', 'Welcome Back!');
        
        const redirectUrl = res.locals.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    });

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/user/login');
    });
});

module.exports = router;