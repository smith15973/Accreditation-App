const passport = require('passport');
const LocalStrategy = require('passport-local');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('./models/user');

// Local Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Microsoft Strategy
passport.use(new MicrosoftStrategy({
    // Standard OAuth2 options
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    callbackURL: process.env.AZURE_REDIRECT_URL,
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
            let isNewUser = false
            if (!user) {
                isNewUser = true
                user = new User({
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    // phone: profile.mobilePhone,
                    requestedPlants: []
                });
                await user.save();
            }
            return done(null, user, {message: isNewUser ? `Welcome to ARC ${user.firstName}` : `Welcome back to ARC ${user.firstName}`});
        } catch (err) {
            return done(err, null);
        }
    }));

    module.exports = passport;