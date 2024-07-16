if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} else {
    require('dotenv').config({ path: '/etc/app.env' });
}
const express = require('express');
const mongoose = require('mongoose');
const plantRoutes = require('./routes/plants');
const userRoutes = require('./routes/users');
const segRoutes = require('./routes/segs');
const reportRoutes = require('./routes/reports');
const aosrRoutes = require('./routes/aosr');
const performanceMatrixRoutes = require('./routes/performanceMatrix');
const saMatrixRoutes = require('./routes/saMatrix');
const generalResourceRoutes = require('./routes/generalResources');
const archiveRoutes = require('./routes/archives');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('./models/user');
const Plant = require('./models/plant')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const favicon = require('serve-favicon');
const catchAsync = require('./utils/catchAsync');
const useragent = require('express-useragent');
const { isLoggedIn, isAuthorized } = require('./middleware');


const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/accreditationApp'
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'public', 'images', 'svg', 'favicon.svg')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(useragent.express());





passport.use(new MicrosoftStrategy({
    // Standard OAuth2 options
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    callbackURL: process.env.AZURE_REDIRECT_URL || 'http://localhost:3000/auth/microsoft/callback',
    scope: ['user.read'],

    // Microsoft specific options

    // [Optional] The tenant ID for the application. Defaults to 'common'. 
    // Used to construct the authorizationURL and tokenURL
    tenant: 'common',

    // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
    authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

    // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
    tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',

    // [Optional] The Microsoft Graph API version (e.g., 'v1.0', 'beta'). Defaults to 'v1.0'.
    graphApiVersion: 'v1.0',

    // [Optional] If true, will push the User Principal Name into the `emails` array in the Passport.js profile. Defaults to false.
    addUPNAsEmail: false,

    // [Optional] The Microsoft Graph API Entry Point, defaults to https://graph.microsoft.com. Configure this if you are using Azure China or other regional version.
    apiEntryPoint: 'https://graph.microsoft.com',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = new User({
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    requestedPlants: []
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));






















const secret = process.env.SECRET || 'DavisBesse'

const store = MongoDBStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});

store.on("error", function (e) {
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ********* Microsoft Configuration ********* //

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
// ***************************************** //


app.use(catchAsync(async (req, res, next) => {
    if (req.user) {
        res.locals.currentUser = await User.findById(req.user._id).populate(['plants', 'requestedPlants']);
    }
    res.locals.url = req.originalUrl;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}));

app.get('/', catchAsync(async (req, res) => {
    const plants = await Plant.find({});
    if (!req.isAuthenticated()) {
        return res.redirect('/user/login')
    }
    res.render('home', { plants });
}));
app.use('/user', userRoutes);
app.use('/plant', plantRoutes);
app.use('/seg', segRoutes);
app.use('/reports', reportRoutes);
app.use('/aosr', aosrRoutes);
app.use('/performanceMatrix', performanceMatrixRoutes);
app.use('/saMatrix', saMatrixRoutes);
app.use('/generalResources', generalResourceRoutes);
app.use('/archives', archiveRoutes);

app.get('/auth/microsoft',
    passport.authenticate('microsoft', {
        // Optionally define any authentication parameters here
        // For example, the ones in https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

        prompt: 'select_account',
    }));

// Callback route for Microsoft to redirect to
app.get('/auth/microsoft/callback', passport.authenticate('microsoft', {
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    res.redirect('/');
});




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}!`);
});
