const router=require("express").Router();
const data=require("../data");
const restaurantsData=data.restaurants;
const reviewsData = data.reviews;
const xss=require("xss");

router.get("/", async (req,res)=>{
    try{
        const theRestaurants=await restaurantsData.getSome();
        res.render('./restaurants/restaurants', {
            theRestaurants:theRestaurants,
            R_location:theRestaurants.R_location
        });  
         
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    }   
});

router.get("/all", async (req,res)=>{
    try{
        const all=await restaurantsData.getAllRestaurants();
        res.render('./restaurants/all', {
            all:all
        });
    }catch(e){
        res.redirect('/');
    }   
});

router.get("/:id", async (req,res)=>{
    try{
        const restaurant=await restaurantsData.getRestaurantById(req.params.id);
        res.render('../views/restaurants/single', {
            restaurant:restaurant
        });
    }catch(e){
        console.log(e);
        res.redirect('/');
    }
});

router.get("/addReview/:id",async (req,res)=>{
    try{
        if(req.user) res.render('../views/restaurants/reviewform',{user: req.user,restaurantId:req.params.id});  
        else res.redirect('/login');        
    }catch(e){
        console.log(e);
        res.redirect('/');
    } 
});

router.get("/:name", async (req,res)=>{
    try{
        const getData=await restaurantsData.getRestaurantByName(req.params.name);
        res.json(getData);
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
    }
});

router.post("/", async (req,res)=>{
    let restaurantInfo=req.body; 
    if (!restaurantInfo) {
        res.status(400).json({ error: "You must provide data to create a restaurant." });
        return;
    }
    if (!restaurantInfo.R_cuisine) {
        res.status(400).json({ error: "You must provide a cuisine." }); 
        return;
    }
    if (!restaurantInfo.R_name) {
        res.status(400).json({ error: "You must provide name." });
        return;
    }
    if (!restaurantInfo.R_href) {
        res.status(400).json({ error: "You must provide href." });
        return;
    }
    if (!restaurantInfo.R_location) {
        res.status(400).json({ error: "You must provide location." });
        return;
    }
    try{
        const newRestaurant=await restaurantsData.addRestaurant(restaurantInfo.R_cuisine,restaurantInfo.R_name,restaurantInfo.R_href,restaurantInfo.R_location);
        res.json(newRestaurant);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    } 
});

module.exports=router;