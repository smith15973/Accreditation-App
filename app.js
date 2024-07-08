if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} else {
    require('dotenv').config({ path: '/etc/app.env' });
}
const express = require('express');
const mongoose = require('mongoose');
const plantRoutes = require('./routes/plants');
const userRoutes = require('./routes/users');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const favicon = require('serve-favicon');
const catchAsync = require('./utils/catchAsync');


const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/accredidationApp'
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


app.use(catchAsync(async (req, res, next) => {
    // console.log(req.user)
    if (req.user) {
        res.locals.currentUser = await User.findById(req.user._id).populate('plants');
    } else {
        res.locals.currentUser = req.user;
    }
    res.locals.url = req.originalUrl;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}));




app.get('/', (req, res) => {
    res.render('home');
});
app.use('/user', userRoutes);
app.use('/', plantRoutes);


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
