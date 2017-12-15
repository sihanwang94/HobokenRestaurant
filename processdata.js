const mongoCollections=require("./config/mongoCollections");
const requiredRestaurant=mongoCollections.restaurants;
const restaurants=require("./data/restaurants");
const ObjectId = require('mongodb').ObjectId;
const dbConnection = require("./config/mongoConnection");



async function replaceReviews(){
    var restaurantsCollection= await requiredRestaurant();
    var ids = await restaurantsCollection.distinct('_id', {}, {}); 
    for(var i = 0;i<ids.length;i++){
        var reviews=[]        
        var theRestaurant=await restaurantsCollection.findOne({_id:ids[i]});
        if (!theRestaurant) throw "Restaurant not found.";
        for(var j = 0;j<theRestaurant.R_review.length;j++){
            var theReview={
                _id:new ObjectId(),
                reviewer_name:theRestaurant.R_review[j].reviewer_name,
                reviewer_like:theRestaurant.R_review[j].reviewer_like,
                review:theRestaurant.R_review[j].review
            };
            reviews.push(theReview)

        }
        await restaurantsCollection.update(
            { _id: theRestaurant._id},
            { $set: { R_review : reviews } }
        )

    } 
    const db = await dbConnection();
    await db.close();    
}

replaceReviews()
