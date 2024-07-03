// Description: This file contains all the middleware functions that are used in the application.
//const { PlantSchema } = require('./schemas.js');
// const ExpressError = require('./utils/ExpressError');
// const Seg = require('./models/seg');
// const catchAsync = require('./utils/catchAsync.js');

module.exports.isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Signed In');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


// module.exports.validateTicket = (req, res, next) => {
//     const { error } = ticketSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

// module.exports.isAuthor = catchAsync(async (req,res,next) => {
//     const {id} =req.params;
//     const ticket = await Ticket.findById(id);
//     if ((!ticket.author || !ticket.author._id.equals(req.user._id)) && !req.user.admin) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/tickets`);
//     }
//     next();
// });

