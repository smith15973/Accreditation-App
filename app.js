if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} else {
    require('dotenv').config({ path: '/etc/app.env' });
}

const express = require('express');
const app = express();
const { dbURL } = require('./mongodb');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('./passport');
const User = require('./models/user');
const Plant = require('./models/plant')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const favicon = require('serve-favicon');
const catchAsync = require('./utils/catchAsync');
const useragent = require('express-useragent');

/**********import routes*************** */
const plantRoutes = require('./routes/plants');
const userRoutes = require('./routes/users');
const segRoutes = require('./routes/segs');
const reportRoutes = require('./routes/reports');
const aosrRoutes = require('./routes/aosr');
const performanceMatrixRoutes = require('./routes/performanceMatrix');
const saMatrixRoutes = require('./routes/saMatrix');
const generalResourceRoutes = require('./routes/generalResources');
const archiveRoutes = require('./routes/archives');


/**********Middleware setup*************** */
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'svg', 'favicon.svg')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(useragent.express());



// Session and Authentication Setup
const secret = process.env.SESSION_SECRET || 'DavisBesse'
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


/**********Error Handling Middleware*************** */
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
