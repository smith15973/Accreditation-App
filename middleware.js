// Description: This file contains all the middleware functions that are used in the application.

// const ExpressError = require('./utils/ExpressError');

const catchAsync = require('./utils/catchAsync.js');
const Plant = require('./models/plant');
const SegInstruction = require('./models/segInstruction');
const mongoose = require('mongoose');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Signed In');
        return res.redirect('/user/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.getCurrentPlantandInstructions = catchAsync(async (req, res, next) => {
    const plantID = req.params.plantID;

    if (!mongoose.isValidObjectId(plantID)) {
        req.flash('error', 'Plant not Found!');
        return res.redirect('/');
    }

    const currentPlant = await Plant.findById(plantID);
    if (!currentPlant) {
        req.flash('error', 'Plant does not exist!');
        return res.redirect('/');
    }
    res.locals.currentPlant = currentPlant;
    res.locals.segInstructions = await SegInstruction.find({}).sort({ segNum: 1 });
    next()
});


// module.exports.validateTicket = (req, res, next) => {
//     const { error } = ticketSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

module.exports.isAuthorized = catchAsync(async (req,res,next) => {;
    if (!req.user.admin) {
        req.flash('error', 'You do not have permission to do that!');
        const redirectUrl = req.get('referer') || '/';
        return res.redirect(redirectUrl);
    }
    next();
});

