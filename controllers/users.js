module.exports = function(User, Tbh, passport, moment){
    return {
        SetRouting: function(router){
            router.get('/', this.sayhi);
            router.get('/tbh/:username', this.tbh);
            router.get('/home', this.directhome);
            router.get('/create/account', this.create);
            router.get('/home/:page', this.home);
            router.post('/create', this.createAccount);
            router.get('/authenticate', this.authenticate);
            router.get('/logout', this.logout);
            router.post('/send', this.sendmessage);
            router.post('/login', this.getInside);
        },
        sayhi: function(req, res){
            if(req.user){
                res.redirect('/home/1')
            }else{
                res.redirect('/create')
            }
        },
        create: function(req, res){
            if(req.user){
                res.redirect('/');
            }else{
                var errors = req.flash('error')
                res.render('signup', {user: req.user, vuser:req.user, errors: errors, hasErrors: errors.length > 0});
            }
        },
        createAccount: passport.authenticate('local.signup', {
            successRedirect: '/',
            failureRedirect: 'back',
            failureFlash: true
        }),
        getInside: passport.authenticate('local.login', {
            successRedirect: '/',
            failureRedirect: 'back',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
        authenticate: function(req, res){
            var errors = req.flash('error');
            if(req.user){
                res.redirect('/home/1/')
            }else{
                res.render('authenticate', { errors: errors, hasErrors: errors.length > 0})
            }
        },
        directhome: function(req, res){
            res.redirect('/home/1');
        },
        home: async function(req, res){
            if(req.user){
                var perPage = 8;
                var page = req.params.page || 1;
                var errors = req.flash('error');
            
                Tbh.find({owner: req.user._id}).skip((perPage * page) - perPage).limit(perPage).sort("created").exec((err, tbhs) => {
                    Tbh.countDocuments().exec((err, count) => {
                        res.render('home', { user: req.user, errors: errors, hasErrors: errors.length > 0, tbhs: tbhs,  current: page,pages: Math.ceil(count / perPage), moment: moment});
                    })
                });
            }else{
                res.redirect('/authenticate');
            }
        },
        tbh: function(req, res){
           User.findOne({ username: req.params.username}).exec((err, user) => {
               if(user){
                var errors = req.flash('error')
                res.render('tbh',  {user: req.user, vuser: user, errors: errors, hasErrors: errors.length > 0});
               }else{
                   res.send("Fk off")
               }
           })
        },
        sendmessage: function(req, res){
            const newtbh = new Tbh();
            newtbh.owner = req.body.uid;
            newtbh.message = req.body.message;
            newtbh.save((err) => {
                if(err) console.log(err);
            });
            User.updateOne({
                _id: req.body.uid
            }, {
                $push: {
                    tbhs: { tbh: newtbh._id}
                }
            }, (err) => {
                if(err) console.log(err);
            })
            res.redirect('back');
        }
    }
}