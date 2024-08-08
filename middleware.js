// Description: This file contains all the middleware functions that are used in the application.

const ExpressError = require('./utils/ExpressError');

const catchAsync = require('./utils/catchAsync.js');
const Plant = require('./models/plant');
const SegInstruction = require('./models/segInstruction');
const mongoose = require('mongoose');
const { plantSchema, dueDateSchema, segInstructionSchema } = require('./schemas.js');
const ResetToken = require('./models/resetToken')
const jwt = require('jsonwebtoken')

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

module.exports.validateUser = (req, res, next) => {
    let { username, password } = req.body;

    username = username.toLowerCase().trim();
    password = password.trim();

    if (username && username.length < 4) {
        req.flash('error', 'Username must be at least 4 characters long')
        return res.redirect('/user/register')
    }
    if (username && username.length > 24) {
        req.flash('error', 'Username must be less than 25 characters long')
        return res.redirect('/user/register')
    }

    if (password && !passwordValidation(password)) {
        req.flash('error', 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        return res.redirect('/user/register')
    }

    next();
};


const generateJWT = (user) => {
    let payload = {
        user: {
            id: user._id,
        }
    }
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    return token
}

const verifyJWTToken = (token) => {
    try {
          let decoded = jwt.verify(token, process.env.JWT_SECRET);
          return {
                error: false,
                decoded: decoded
          }
    } catch (err) {
          console.log("error decoding token");
          console.log(err);
          return {
                error: true,
                message: err.message
          }
    }
}

module.exports.createResetToken = async (user) => {
    if (!user) {
        req.flash('error', 'User does not exist!')
        res.redirect('/user/forgotPassword')
    }
    let resetToken = await ResetToken.findOne({ user: user._id });
    if (resetToken) {
        await resetToken.deleteOne();
    }
    let newResetToken = new ResetToken({
        user: user._id,
        resetToken: generateJWT(user),
        createdAt: new Date(),
    })
    
    await newResetToken.save()
    return newResetToken.resetToken
}

module.exports.verifyToken = catchAsync(async (req, res, next) => {
    const { resetToken } = req.params;
    const resetTokenObj = await ResetToken.findOne({ resetToken });
    if (!resetTokenObj || verifyJWTToken(resetToken).error) {
        req.flash('error', 'Invalid or expired token');
            return res.redirect('/user/forgotPassword');
    }

    next()
})