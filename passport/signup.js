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
})

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({'username': username}, (err, user) => {
        if(err){
            console.log(err);
            return done(null, false, req.flash('error', 'Weak Connectivity'));
        }

        if(user){
            return done(null, false, req.flash('error', 'User already exists'));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save(function(err){
            if(err) console.log(err);
            console.log("Success");
            return done(null, newUser);
        });
    })
}));
