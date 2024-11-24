const passport = require('passport');
const dotenv = require('dotenv');
const User = require('../model/Usermodel');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

dotenv.config({ path: './config.env' })

const gid = process.env.GOOGLE_CLIENT_ID;
console.log('Wadeee', gid);

const gcs = process.env.GOOGLE_CLIENT_SECRET;
console.log("Wow", gcs)
passport.use(new GoogleStrategy({
    clientID: gid,
    clientSecret: gcs,
    callbackURL: "http://localhost:3000/homepage",
    passReqToCallback: true
},
    // create a user in the database or check if the usr is logged in before
    function (request, accessToken, refreshToken, profile, done) {
        return done(err, profile);

    }
));

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (user, done) {
    done(null, user)
});