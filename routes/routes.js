const router=require("express").Router();
const data=require("../data");
const restaurantsData=data.restaurants;

module.exports = function(app, passport) {
    
    // normal routes ===============================================================
        // show the home page (will also have our login links)

        app.get('/', async function(req, res) {
            try{
                const theRestaurants=await restaurantsData.getSome();
                res.render('./restaurants/restaurants', {
                    theRestaurants:theRestaurants
                });   
            }catch(e){
                console.log(e);
                res.redirect('/restaurants');
            }   
        });
    
        // PROFILE SECTION =========================
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile', {
                user : req.user
            });
        });
    
        // LOGOUT ==============================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================
    
        // locally --------------------------------
            // LOGIN ===============================
            // show the login form
            app.get('/login', function(req, res) {
                res.render('login', { message: req.flash('loginMessage') });
            });
    
            // process the login form
            app.post('/login', passport.authenticate('local-login', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/login', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));
    
            // SIGNUP =================================
            // show the signup form
            app.get('/signup', function(req, res) {
                res.render('signup', { message: req.flash('signupMessage') });
            });
    
            // process the signup form
            app.post('/signup', passport.authenticate('local-signup', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/signup', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));
    

    
    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================
    
        // locally --------------------------------
            app.get('/connect/local', function(req, res) {
                res.render('connect-local', { message: req.flash('loginMessage') });
            });
            app.post('/connect/local', passport.authenticate('local-signup', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));
    
    
    
    };
    
    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    
        res.redirect('/');
    }