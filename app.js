if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} else {
    require('dotenv').config({ path: '/etc/app.env' });
}

const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { availableParallelism } = require('node:os');
const cluster = require('node:cluster');
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');


if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    // create one worker per available core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({
            PORT: 3000 + i
        });
    }

    // set up the adapter on the primary thread
    return setupPrimary;
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter()
});

const cors = require('cors');
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
const SegProgram = require('./models/segProgram')
const Seg = require('./models/seg')



/**********import routes*************** */
const plantRoutes = require('./routes/plants');
const userRoutes = require('./routes/users');
const segRoutes = require('./routes/segs');
const reportRoutes = require('./routes/reports');
const aosrRoutes = require('./routes/aosr');
const tiMatrixRoutes = require('./routes/tiMatrix');
const saMatrixRoutes = require('./routes/saMatrix');
const generalResourceRoutes = require('./routes/generalResources');
const archiveRoutes = require('./routes/archives');


/**********Middleware setup*************** */
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'svg', 'favicon.svg')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/nodeModules', express.static(path.join('/Users/noah/Desktop/Davis_Besse/Accreditation App/node_modules')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride('_method'));
app.use(useragent.express());





io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });
});
io.on('connection', (socket) => {
    socket.on('supportingDataUpdate', async (data) => {
        const program = await SegProgram.findByIdAndUpdate(data.programID, { supportingData: data.text }, { new: true })
        io.emit('supportingDataUpdate', data);
    });
    socket.on('conclusionUpdate', async (data) => {
        const program = await SegProgram.findByIdAndUpdate(data.programID, { conclusion: data.text }, { new: true })
        io.emit('conclusionUpdate', data);
    });
    socket.on('aosrUpdate', async (data) => {
        const program = await SegProgram.findByIdAndUpdate(data.programID, { aosr: data.text }, { new: true })
        io.emit('aosrUpdate', data);
    });

    socket.on('programStatusUpdate', async (data) => {
        const history = {
            event: `Status changed to ${data.status}`,
            date: Date.now(),
            user: data.userID,
        }

        const program = await SegProgram.findByIdAndUpdate(data.programID, { status: data.status }, { new: true }).populate(['plant', { path: 'seg', populate: { path: 'segInstruction' } }]);
        program.history.push(history);
        await program.save();

        // const users = await User.find({ plants: program.plant, admin: true });
        // let emails = users.map(user => user.email);

        // const emailToSend = {
        //     from: 'ARC App',
        //     to: emails,
        //     subject: `Program Status Change: ${data.status}`,
        //     text: `The ${program.plant.name} status of program "${program.name}" for ${program.seg.segInstruction.segInstructionID} has been changed to ${data.status}.`,
        //     html: `The ${program.plant.name} status of program "${program.name}" for <a href="${process.env.APP_URL}/plant/${program.plant._id}/seg/${program.seg.segInstruction._id}">${program.seg.segInstruction.segInstructionID}</a> has been changed to ${data.status}.`,
        // }
        // sendEmail(emailToSend).catch(console.error);

        io.emit('programStatusUpdate', program);
        const seg = await Seg.findOne({ segPrograms: program._id }).populate(['segPrograms', 'segInstruction'])
        let allPrograms = await SegProgram.find({ plant: seg.plant }).populate({ path: 'seg', populate: { path: 'segInstruction' } })
        allPrograms = allPrograms.filter(program => program.seg.segInstruction.team === seg.segInstruction.team && program.seg.segInstruction.department === seg.segInstruction.department)

        io.emit('reportTableStatusUpdate', { seg, allPrograms });
    })
});



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
app.use('/tiMatrix', tiMatrixRoutes);
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

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}!`);
});
