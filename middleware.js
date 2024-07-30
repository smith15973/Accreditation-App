// Description: This file contains all the middleware functions that are used in the application.

const ExpressError = require('./utils/ExpressError');

const catchAsync = require('./utils/catchAsync.js');
const Plant = require('./models/plant');
const SegInstruction = require('./models/segInstruction');
const mongoose = require('mongoose');
const { plantSchema, dueDateSchema, segInstructionSchema } = require('./schemas.js')

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

module.exports.isAdmin = catchAsync(async (req, res, next) => {
    ;
    if (!req.user.admin) {
        req.flash('error', 'You do not have permission to do that!');
        const redirectUrl = req.get('referer') || '/';
        return res.redirect(redirectUrl);
    }
    next();
});

module.exports.hasPlantAccess = catchAsync(async (req, res, next) => {
    ;
    if (!req.user.plants.includes(res.locals.currentPlant._id)) {
        req.flash('error', 'You do not have permission to access this plant!');
        const redirectUrl = req.get('referer') || '/';
        return res.redirect(redirectUrl);
    }
    next();
});

module.exports.validatePlant = (req, res, next) => {
    const { error } = plantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateDueDate = (req, res, next) => {
    const { error } = dueDateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateSegInstruction = (req, res, next) => {
    const { error } = segInstructionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


function passwordValidation(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,25}$/;
    return passwordRegex.test(password);
}

module.exports.validatePassword = (req, res, next) => {
    const { password } = req.body;

    if (password && !passwordValidation(password)) {
        req.flash('error', 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        return res.redirect('/user/register')
    }

    next();
};


