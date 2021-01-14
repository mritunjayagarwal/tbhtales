const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
// const compression = require('compression');
// const helmet = require('helmet');
const container = require("./container");

container.resolve(function(users, _){

    const app = showExpress();

    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb+srv://galacto:zoniakk1@tbhtales.nkv6e.mongodb.net/tbhtales?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true})

    function showExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIo(server);

        configureExpress(app);

        server.listen(process.env.PORT || 8080, function(){
            console.log("Connected to THE GLA NETWORK");
        });

        const router = require('express-promise-router')();
        users.SetRouting(router);
        // tbh.SetRouting(router);

        app.use(router);

        app.use(function(req, res){
            res.send("404 page not found");
        })

    }

    function configureExpress(app){

        // app.use(compression());
        // app.use(helmet());

        require('./passport/signup');
        require('./passport/login');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true}));
        app.set('view engine', 'ejs');
        app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: "hey",
            cookie : {
                maxAge: 1000* 60 * 60 *24 * 365
            },
            store: new MongoStore({ mongooseConnection: mongoose.connection})
        }))
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ = _;
    }
})