const mongoCollections=require("../config/mongoCollections");
const requiredRestaurant=mongoCollections.restaurants;
const restaurants=require("./restaurants");
const ObjectId = require('mongodb').ObjectId;
const HashMap = require('hashmap');

//filter: get all reviews for the restaurant
async function getReviewsByRestaurantId(restaurantId) {
    if(restaurantId===undefined) throw "Please provide an restaurantId.";
    const restaurantsCollection=await requiredRestaurant();
    const theRestaurant=await restaurantsCollection.findOne({_id:ObjectId(restaurantId)});
    const theReviews=theRestaurant.R_review;
    if(!theRestaurant || theRestaurant===null) throw "No restaurant with that restaurantId.";
    const result=[];
    for(let i=0;i<theReviews.length;i++){
        let reviewsResult={
            restaurantId:theRestaurant._id,
            reviewer_name:theReviews[i].reviewer_name,
            reviewer_like:theReviews[i].reviewer_like,
            review:theReviews[i].review  
        } 
        result.push(reviewsResult);   
    }  
    return result;   
}

//filter: get average like for the restaurant
async function getAverageLike(restaurantId){
    const allReviews=await this.getReviewsByRestaurantId(restaurantId);
    if(!allReviews || allReviews.length===0) throw "No review found for the restaurantId"
    let sum=0;
    for(let i=0;i<allReviews.length;i++){
        sum+=allReviews[i].reviewer_like;
    }
    const res=sum/(allReviews.length+1);   
    return parseFloat((res).toFixed(2));
}

//filter: get the restaurant by cuisine
async function classifyCuisines(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await await restaurantsCollection.find({}).toArray();
    let sandwiches=await restaurantsCollection.find({'R_cuisine':{'$all':['Sandwiches']}}).toArray(); 
    let italian=await restaurantsCollection.find({'R_cuisine':{'$all':['Italian']}}).toArray();
    let coffeeAndTea=await restaurantsCollection.find({'R_cuisine':{'$all':['Coffee & Tea']}}).toArray();
    let branch=await restaurantsCollection.find({'R_cuisine':{'$all':['Breakfast & Brunch']}}).toArray();
    let american=await restaurantsCollection.find({'R_cuisine':{'$all':[/American.*/]}}).toArray();
    let chinese=await restaurantsCollection.find({'R_cuisine':{'$all':['Chinese']}}).toArray();
    let delis=await restaurantsCollection.find({'R_cuisine':{'$all':['Delis']}}).toArray();
    let pizza=await restaurantsCollection.find({'R_cuisine':{'$all':['Pizza']}}).toArray();
    let bars=await restaurantsCollection.find({'R_cuisine':{'$all':[/Bars.*/]}}).toArray();
    return bars;   
}
//classifyCuisines();

async function mappingCuisines(){
    const allCuisines=await this.gatherCuisines();
    let HashMap={};
    for(let i=0;i<allCuisines.length;i++){
        HashMap[allCuisines[i]]=HashMap[allCuisines[i]]+1 || 1;
    }
    const result=[];
    for(var key in HashMap){
        result.push(HashMap[key]+":"+key)
    }
    return result;
}

async function gatherCuisines(){
    const allRestaurants=await restaurants.getAllRestaurants();
    const result=[];
    if(allRestaurants){
        for(let i=0;i<allRestaurants.length;i++){
            for(let j=0;j<allRestaurants[i].R_cuisine.length;j++){
                result.push(allRestaurants[i].R_cuisine[j])
            }  
        }
    }
    return result; 
}

async function addReview(restaurantId,name,like,review) {
    const restaurantsCollection=await requiredRestaurant();
    const theRestaurant=await restaurantsCollection.findOne({_id: restaurantId});
    if (!theRestaurant) throw "Restaurant not found.";

    let theReview={
        _id:new ObjectId(),
        reviewer_name:name,
        reviewer_like:like,
        review:review
    };
 
    let newReview={
        $push: {R_review: theReview}  
    };
    await restaurantsCollection.updateOne({_id: restaurantId},newReview);   
    return theReview;
}


module.exports={getReviewsByRestaurantId,getAverageLike,classifyCuisines,gatherCuisines,mappingCuisines,addReview};