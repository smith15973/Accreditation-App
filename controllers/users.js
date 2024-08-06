const User = require('../models/user');
const Plant = require('../models/plant')
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');



module.exports.renderMicrosoftLogin = passport.authenticate('microsoft', {
    // Optionally define any authentication parameters here
    // For example, the ones in https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
    prompt: 'select_account',
});

module.exports.microsoftAuthenticate = passport.authenticate('microsoft', {
    failureRedirect: '/user/login',
    failureFlash: true
})

module.exports.renderRegister = catchAsync(async (req, res) => {
    if (res.locals.currentUser) {
        return res.redirect('/')
    }
    const plants = await Plant.find({});
    res.render('users/register', { plants });
})

module.exports.register = catchAsync(async (req, res) => {
    try {
        let { username, password, email, firstName, lastName } = req.body;
        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();
        password = password.trim();
        firstName = firstName.trim();
        lastName = lastName.trim();
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            req.flash('error', 'Email is already registered');
            return res.redirect('/user/register');
        }
        const user = new User({ email, username, firstName, lastName });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to ARC');
            return res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/register');
    }

})

module.exports.renderLogin = (req, res) => {
    if (res.locals.currentUser) {
        return res.redirect('/')
    }
    res.render('users/login');
}

module.exports.login = (req, res) => {

    const flashMessage = req.authInfo && req.authInfo.message ? req.authInfo.message : 'Welcome Back to ARC!';
    req.flash('success', flashMessage);

    const redirectUrl = res.locals.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/user/login');
    });
}


module.exports.requestPlantAccess = catchAsync(async (req, res) => {
    const { userID, plantID } = req.params;
    const user = await User.findById(userID);
    if (!user.requestedPlants.includes(plantID) && !user.plants.includes(plantID)) {
        user.requestedPlants.push(plantID)
        await user.save()
    }
    res.redirect('/');
})


/************Manage Plant Access Requests****************/
module.exports.viewMembers = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    const users = await User.find({});
    const requestingUsers = users.filter(user => user.requestedPlants.includes(plantID));
    const approvedUsers = users.filter(user => user.plants.includes(plantID));
    res.render('users/manage', { requestingUsers, approvedUsers });
});

module.exports.approveOrChangeMemberStatus = catchAsync(async (req, res) => {
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
})
module.exports.removeMember = catchAsync(async (req, res) => {
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
});

module.exports.searchForUsers = catchAsync(async (req, res) => {

    const searchRequest = req.query.search;
console.log(searchRequest);

if (searchRequest) {
    // Split the search request by spaces
    const searchTerms = searchRequest.split(' ').filter(term => term);

    // Create regex patterns for each term
    const regexTerms = searchTerms.map(term => new RegExp(term, 'i'));

    // Build the aggregation pipeline
    const pipeline = [
        {
            $match: {
                "$or": [
                    { "firstName": { "$in": regexTerms } },
                    { "lastName": { "$in": regexTerms } },
                    { "email": { "$in": regexTerms } }
                ]
            }
        },
        {
            $addFields: {
                score: {
                    $add: [
                        { $cond: [{ $regexMatch: { input: "$firstName", regex: regexTerms[0] } }, 1, 0] },
                        { $cond: [{ $regexMatch: { input: "$lastName", regex: regexTerms[0] } }, 1, 0] },
                        { $cond: [{ $regexMatch: { input: "$email", regex: regexTerms[0] } }, 1, 0] }
                    ]
                }
            }
        },
        {
            $sort: { score: -1 }
        },
        {
            $limit: 5
        }
    ];

    // Find users
    const users = await User.aggregate(pipeline);
    res.json(users);
} else {
    res.json([]); // or handle empty search request as needed
}
});