const router=require("express").Router();
const data=require("../data");
const restaurantsData=data.restaurants;
const reviewsData=data.reviews;
const User=require("../data/user")
const review=require("../data/reviews")


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
        app.get('/profile', isLoggedIn, async function(req, res) {
            try{
                const reviews = await reviewsData.getReviewsByUserId(req.user._id)

                res.render('profile', {
                    user : req.user,
                    reviews:reviews
                });

                if(!reviews){
                    res.render('profile',{user : req.user})
                }else{
                    res.render('profile', {
                        user : req.user,
                        reviews:reviews
                    });
                }


                }catch(e){
                    console.log(e);
                    res.redirect('/');
                }
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

            //=============to enter adminProfile==============
            app.get('/ADM',(req,res)=>{
                //======================================
                 if(req.user.local.email==='admin'){
                    res.render('admin/adminProfile',{});
                    }else{
                                res.render('login', { message: req.flash('errorMessage') });
                         }
                  });

    //================get adminProfile==========
    
            app.get('/adminProfile', isLoggedIn, function(req, res) {
                if(req.user) res.render('adminProfile',{});
                else{
                    res.render('login')
                }
            }); 
            
    //=============find a user to userSearch page==========         
    
            app.post('/result',(req,res)=>{
                //======================================
                if(req.user){
                    User.findOne({'local.email' :  req.body.keyword},(err,user)=>{
                    res.render('admin/userSearch',{user:user});
                    res.render('body/result_err',{}
                    )
                    
                });
                }
                else res.redirect('../login');
                });
    
                //show userlist here
        //===============find all users====================     
    
            app.post('/resultall',(req,res)=>{
                if(req.user){
                    User.find({}).toArray().then((allUsers)=>{
                        console.log(allUsers);
                        const result=[];
                        for(let i=0;i<allUsers.length;i++){
                            let content={
                                _id:allUsers[i]._id,
                                email:allUsers[i].local.email
                            }
                                result.push(content);
                                }res.render('userList', {allusers: result});
    
                        })}else res.redirect('/login');  
                    }
        );
    //==========view user review=================
    app.post('/reviewHistory',(req,res)=>{
        if(req.user){
            const reviewlist=review.getReviewsByUserId(req.user._id);
            res.render('userSearch',{reviewlist:reviewlist});
            }else res.redirect('/login');  
            }
);
    
    };
    

   
    
    
    
    
    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    
        res.redirect('/login');
    }