const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
});

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({'username': username}, (err, user) => {
        if(err){
            return done(err);
        }

        const messages = []
        if(!user || !user.compare(password)){
            messages.push('Username Does not exist or password does not match');
            return done(null, false, req.flash('error', messages));
        }

        return done(null, user);
    })
}))
