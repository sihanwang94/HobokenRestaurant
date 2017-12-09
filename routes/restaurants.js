const router=require("express").Router();
const data=require("../data");
const restaurantsData=data.restaurants;
const xss=require("xss");
 
router.get("/", async (req,res)=>{
    try{
        const getData=await restaurantsData.getAllRestaurants();
        res.json(getData);
    }catch(e){
        console.log(e);
        res.status(500).json({error: e});
    }   
});

// router.get("/", async (req,res)=>{
//     try{
//         const theRestaurants=await restaurantsData.getAllRestaurants();
//         for(let i=0;i<theRestaurants.length;i++){
//             res.render('/restaurants', {
//                 restaurantsName:theRestaurants[0]
//             });
//         }
//         //console.log(theRestaurants[0].R_name);   
        
//     }catch(e){
//         console.log(e);
//         res.redirect('/users');
//     }   
// });


router.get("/all", async (req,res)=>{
    try{
        const getData=await restaurantsData.getAll();
        res.json(getData);
    }catch(e){
        res.status(500).json({error: e});
    }   
});

router.get("/:id", async (req,res)=>{
    try{
        const getData=await restaurantsData.getRestaurantById(req.params.id);
        res.json(getData);
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
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