const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plant = require('../models/plant')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess } = require('../middleware');

router.route('/register')
    .get(catchAsync(async (req, res) => {
        const plants = await Plant.find({});
        res.render('users/register', { plants });
    }))

    .post(catchAsync(async (req, res) => {
        try {
            const { username, password, email, firstName, lastName } = req.body;
            const user = new User({ email, username, firstName, lastName });
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
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), (req, res) => {
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

router.route('/:userID/request/:plantID')
    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { userID, plantID } = req.params;
        const user = await User.findById(userID);
        if (!user.requestedPlants.includes(plantID) && !user.plants.includes(plantID)) {
            user.requestedPlants.push(plantID)
            await user.save()
        }
        res.redirect('/');
    }))


/************Manage Plant Access Requests****************/
router.route('/manage/:plantID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, catchAsync(async (req, res) => {
        const { plantID } = req.params;
        const users = await User.find({});
        const requestingUsers = users.filter(user => user.requestedPlants.includes(plantID));
        const approvedUsers = users.filter(user => user.plants.includes(plantID));
        res.render('users/manage', { requestingUsers, approvedUsers });
    }));

router.route('/:userID/manage/:plantID')
    .put(isLoggedIn, isAdmin, getCurrentPlantandInstructions, hasPlantAccess, catchAsync(async (req, res) => {
        const { plantID, userID } = req.params;
        const user = await User.findById(userID);
        const plant = await Plant.findById(plantID);

        if (req.query.rank === 'changed') {
            if (req.body.rank === 'admin') {
                user.admin = true;
            } else if (req.body.rank === 'member') {
                user.admin = false;
            }
            await user.save();
            return res.redirect(`/user/manage/${plantID}`);
        }

        if (req.query.status === 'requested') {
            user.requestedPlants = user.requestedPlants.filter(id => id.toString() !== plantID)
        }
        user.plants.push(plantID)
        plant.users.push(userID)
        await user.save();
        await plant.save();
        res.redirect(`/user/manage/${plantID}`);
    }))
    .delete(isLoggedIn, isAdmin, getCurrentPlantandInstructions, hasPlantAccess, catchAsync(async (req, res) => {
        const { plantID, userID } = req.params;
        const user = await User.findById(userID);
        const plant = await Plant.findById(plantID);
        if (req.query.status === 'requested') {
            // Remove the plantID from the requestedPlants array
            user.requestedPlants = user.requestedPlants.filter(id => id.toString() !== plantID);
        } else {
            // Remove the plantID from the plants array
            user.plants = user.plants.filter(id => id.toString() !== plantID);
            plant.users = plant.users.filter(id => id.toString() !== userID)

        }
        await user.save();
        await plant.save()
        res.redirect(`/user/manage/${plantID}`);
    }));


module.exports = router;