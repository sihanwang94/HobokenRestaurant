const router=require("express").Router();
const reviewsData=require("../data/reviews");
const restaurantsData=require("../data/restaurants");

router.get("/", async (req,res)=>{
    res.status(200).send("Review root");
});

router.get("/restaurant",async (req,res)=>{
    res.status(200).send("Restaurant root");
});


router.get("/restaurant/:restaurantId", async (req,res)=>{
    try{
        const reviewsList=await reviewsData.getReviewsByRestaurantId(req.params.restaurantId);
        res.json(reviewsList); 
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
    } 
});

router.get("/averageLike/:restaurantId", async (req,res)=>{
    try{
        const reviewsList=await reviewsData.getAverageLike(req.params.restaurantId);  
        res.json(reviewsList);  
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
    } 
    try{
        await reviewsData.getReviewsByRestaurantId(req.params.restaurantId);  
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
    } 

});

router.get("/rating", async (req,res)=>{
    try{
        const theRestaurants=await reviewsData.getRating();
        res.render('../views/restaurants/rating', {
            theRestaurants:theRestaurants
        });
    }catch(e){
        console.log(e);
        res.redirect('/');
    } 
});

router.get("/nearby", async (req,res)=>{
    try{
        const theRestaurants=await restaurantsData.getAllRestaurants();
        res.render('../views/restaurants/nearby', {
            theRestaurants:theRestaurants
        });
    }catch(e){
        console.log(e);
        res.redirect('/');
    } 
});


router.get("/cuisine", async (req,res)=>{
    try{
        const theRestaurants=await reviewsData.classifyCuisines();
        res.render('../views/restaurants/cuisine', {
            theRestaurants:theRestaurants
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});

router.get("/cuisine/sandwiches", async (req,res)=>{
    try{
        const sandwiches=await reviewsData.getSandwiches();
        res.render('../views/restaurants/sandwiches', {
            sandwiches:sandwiches
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/italian", async (req,res)=>{
    try{
        const italian=await reviewsData.getItalian();
        res.render('../views/restaurants/italian', {
            italian:italian
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/coffeeAndTea", async (req,res)=>{
    try{
        const coffeeAndTea=await reviewsData.getCoffeeAndTea();
        res.render('../views/restaurants/coffeeAndTea', {
            coffeeAndTea:coffeeAndTea
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/branch", async (req,res)=>{
    try{
        const branch=await reviewsData.getBranch();
        res.render('../views/restaurants/branch', {
            branch:branch
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/american", async (req,res)=>{
    try{
        const american=await reviewsData.getAmerican();
        res.render('../views/restaurants/american', {
            american:american
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/chinese", async (req,res)=>{
    try{
        const chinese=await reviewsData.getChinese();
        res.render('../views/restaurants/chinese', {
            chinese:chinese
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/delis", async (req,res)=>{
    try{
        const delis=await reviewsData.getDelis();
        res.render('../views/restaurants/delis', {
            delis:delis
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/pizza", async (req,res)=>{
    try{
        const pizza=await reviewsData.getPizza();
        res.render('../views/restaurants/pizza', {
            pizza:pizza
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});
router.get("/cuisine/bars", async (req,res)=>{
    try{
        const bars=await reviewsData.getBars();
        res.render('../views/restaurants/bars', {
            bars:bars
        });
    }catch(e){
        console.log(e);
        res.redirect('/restaurants');
    } 
});

router.get("/:restaurantId/:reviewId", async (req,res)=>{
    try{
        const reviewInfo=await reviewsData.getReviewByReviewId(req.params.restaurantId,req.params.reviewId);
        res.json(reviewInfo);
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The review not found."});
    } 
});

router.post("/:restaurantId", async (req,res)=>{
    let restaurantInfo=req.body;
    let userInfo = req.user;
    let restaurantId=req.params.restaurantId
    if(!restaurantInfo){
        res.status(400).json({error:"You must provide data to create a review."});
        return;
    }
    if(!restaurantInfo.reviewer_like){
        res.status(400).json({error:"You must provide reviewer_like."});
        return;
    }
    if(!restaurantInfo.review){
        res.status(400).json({error:"You must provide review."});
        return;
    }
    try {
        const result=await reviewsData.addReview(userInfo._id,restaurantId,userInfo.local.email,restaurantInfo.reviewer_like,restaurantInfo.review);
        res.json(result);
    } catch (e){
        console.log(e);
        res.status(500).json({error:e});
    }
});

router.put("/:restaurantId/:reviewId",async (req,res)=>{
    let reviewInfo=req.body;
    if(!reviewInfo){
        res.status(400).json({error:"You must provide data to update a review."});
        return;
    }
    if(!req.params.restaurantId){
        res.status(400).json({error:"You must provide a restaurantId."});
        return;
    }
    if(!req.params.reviewId){
        res.status(400).json({error:"You must provide a reviewId."});
        return;
    }
    try{
        await reviewsData.getReviewByreviewId(req.params.reviewId);
    }catch(e){
        console.log(e);
        res.status(404).json({error:"Review not found."});
    }
    try{
        const result=await reviewsData.updateReview(req.params.restaurantId,req.params.reviewId,reviewInfo);
        res.json(result);
    }catch(e){
        console.log(e);
        res.status(500).json({error:e});
    } 
});

router.delete("/:id", async (req,res)=>{
    try{
        await reviewsData.getReviewByReviewId(req.params.id);
    }catch(e){
        res.status(404).json({error:"The review not found."});
    }
    try{
        const result=await reviewsData.deleteReview(req.params.id);
        res.sendStatus(200);
    }catch(e){
        res.status(500).json({error:e});
    }
});

module.exports=router;