const mongoCollections=require("../config/mongoCollections");
const requiredRestaurant=mongoCollections.restaurants;
const requiredUsers =mongoCollections.users;
const restaurants=require("./restaurants");
const ObjectId = require('mongodb').ObjectId;
const HashMap = require('hashmap');

async function getReviewsByUserId(userId) {
    if(userId===undefined) throw "Please provide an userId.";
    const usersCollection=await requiredUsers();
    const theUser=await usersCollection.findOne({_id:ObjectId(userId)});
    const theReviews=theUser.reviews;
    const restaurantsCollection=await requiredRestaurant();
    if(!theUser || theUser===null) throw "No user with that userId.";
    if(!theReviews || theReviews===null) return null;
    const result=[];
    for(let i=0;i<theReviews.length;i++){
        var theRestaurant=await restaurantsCollection.findOne({_id:ObjectId(theReviews[i].restaurantID)});

        let reviewsResult={
            restaurantName:theRestaurant.R_name,
            restaurantID:theReviews[i].restaurantID,
            reviewID:theReviews[i].reviewID,
            reviewer_name:theReviews[i].reviewer_name,
            reviewer_like:theReviews[i].reviewer_like,
            review:theReviews[i].review  
        } 
        result.push(reviewsResult);   
    }  
    return result;   
}

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
    if(restaurantId===undefined) throw "Please provide an restaurantId.";
    const restaurantsCollection=await requiredRestaurant();
    const theRestaurant=await restaurantsCollection.findOne({_id:ObjectId(restaurantId)});
    const allReviews=theRestaurant.R_review;
    if(!allReviews){
        throw "No review found for the restaurantId"
    } 
    let sum=0;
    for(let i=0;i<allReviews.length;i++){
        sum+=allReviews[i].reviewer_like;
    }
    const res=sum/(allReviews.length);   
    const averageLike= parseFloat((res).toFixed(1));
    return (allReviews.length!==0)? averageLike:0;
}

//filter: add rating for all restaurants
async function addRatingForAll() {
    const restaurantsCollection=await requiredRestaurant();
    const allRestaurants=await restaurantsCollection.find({}).toArray();
    let resultsList=[];
    for(let i=0;i<allRestaurants.length;i++){
        const averageLike=await getAverageLike(allRestaurants[i]._id);
        let list=[];
        let content={
            _id:allRestaurants[i]._id,
            R_averageaLike:averageLike,
            R_cuisine:allRestaurants[i].R_cuisine,
            R_name:allRestaurants[i].R_name,
            R_href:allRestaurants[i].R_href,
            R_location:allRestaurants[i].R_location
        }
        resultsList.push(content);     
    }
    return resultsList; 
}

//filter: sort rating for all restaurants
async function getRating() {
   const all=await addRatingForAll();
   return all.sort( function(a, b){   
        return parseFloat(a["R_averageaLike" ]) < parseFloat(b["R_averageaLike" ]) ? 1 : parseFloat(a[ "R_averageaLike"]) == parseFloat(b[ "R_averageaLike" ]) ? 0 : -1;   
    });  
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
    let data=[sandwiches,italian,coffeeAndTea,branch,american,chinese,delis,pizza,bars]
    return data;   
}
//classifyCuisines();

async function getSandwiches(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let sandwiches=await restaurantsCollection.find({'R_cuisine':{'$all':['Sandwiches']}}).toArray(); 
    return sandwiches;   
}
async function getCoffeeAndTea(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let coffeeAndTea=await restaurantsCollection.find({'R_cuisine':{'$all':['Coffee & Tea']}}).toArray();
    return coffeeAndTea;   
}
async function getItalian(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let italian=await restaurantsCollection.find({'R_cuisine':{'$all':['Italian']}}).toArray(); 
    return italian;   
}
async function getBranch(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let branch=await restaurantsCollection.find({'R_cuisine':{'$all':['Breakfast & Brunch']}}).toArray();
    return branch;   
}
async function getAmerican(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let american=await restaurantsCollection.find({'R_cuisine':{'$all':[/American/]}}).toArray();
    return american;   
}
async function getChinese(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let chinese=await restaurantsCollection.find({'R_cuisine':{'$all':['Chinese']}}).toArray();
    return chinese;   
}
async function getDelis(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let delis=await restaurantsCollection.find({'R_cuisine':{'$all':['Delis']}}).toArray();
    return delis;   
}
async function getPizza(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let pizza=await restaurantsCollection.find({'R_cuisine':{'$all':['Pizza']}}).toArray();
    return pizza;   
}
async function getBars(){
    const restaurantsCollection=await requiredRestaurant();
    const all=await restaurantsCollection.find({}).toArray();
    let bars=await restaurantsCollection.find({'R_cuisine':{'$all':[/Bars/]}}).toArray();
    return bars;   
}

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

async function getReviewByreviewId(id) {
    if(id===undefined) throw "Please provide an id.";
    const restaurantsCollection=await requiredRestaurant();
    const theRestaurants=await restaurants.getAllRestaurants();
    //const result=[];
    for(let i=0;i<theRestaurants.length;i++){
        const theReviews = await this.getReviewsByRestaurantId(theRestaurants[i]._id);
        console.log(theReviews);
        if (theReviews) {
            for(let i=0;i<theReviews.length;i++){
                if(theReviews[i]._id){
                    if(theReviews[i]._id===id){
                        return theReviews[i];
                    } 
                }else{
                    continue;
                }
            }
        }      
    }
    // if(id === null || (id.length !== 12 && id.length !== 24)) throw "Please provide an id.";
    // const restaurantsCollection=await requiredRestaurant();
    // const theRestaurant=await restaurantsCollection.findOne({'R_review._id':ObjectId(id)});
    // if(!theRestaurant || theRestaurant===null) throw "No restaurant with that name.";
    // return theRestaurant;
    
}

async function addReview(userId,restaurantId,name,like,review) {
    const restaurantsCollection=await requiredRestaurant();
    const usersCollection = await requiredUsers();
    const theUser = await usersCollection.findOne({_id: ObjectId(userId)});
    const theRestaurant=await restaurantsCollection.findOne({_id: ObjectId(restaurantId)});
    if (!theRestaurant) throw "Restaurant not found.";
    let theReview={
        _id:new ObjectId(),
        reviewer_name:name,
        reviewer_like:like,
        review:review
    };
    let userReivew={
        restaurantID:restaurantId,
        reviewID:theReview._id,
        reviewer_name:theUser.local.email,
        reviewer_like:like,
        review:review
    }
    let newReview={
        $push: {R_review: theReview}  
    };
    let newUserReview={
        $push: {reviews: userReivew}  
    };
    await restaurantsCollection.updateOne({_id: ObjectId(restaurantId)},newReview);  
    await usersCollection.updateOne({_id: ObjectId(userId)},newUserReview);       
    return theReview;
}

//Updates the specified review for the restaurant  with only the supplied changes,and return the updated Review
async function updateReview(restaurantId,reviewId,suppliedChange){
    const restaurantsCollection=await requiredRestaurant();
    const theRestaurant=await restaurantsCollection.findOne({ _id: ObjectId(restaurantId)});
    if(theRestaurant) {
        if (suppliedChange.reviewer_name) {
            restaurantsCollection.update({'R_review._id':reviewId}, {$set:{'R_review.$.reviewer_name': suppliedChange.reviewer_name}});
        }
        if (suppliedChange.reviewer_like) {
            restaurantsCollection.update({'R_review._id':reviewId}, {$set:{'R_review.$.reviewer_like': suppliedChange.reviewer_like}});
        }
        if (suppliedChange.review) {
            restaurantsCollection.update({'R_review._id':reviewId}, {$set:{'R_review.$.review': suppliedChange.review}});
        }
    }     
    return await this.getReviewByreviewId(reviewId);
}

//Deletes the Review specified
async function deleteReview(id){
    if(!id) throw "No id provided.";

    const restaurantsCollection=await requiredRestaurant();
    const theRestaurants=await restaurants.getAllRestaurants();
    for(let i=0;i<theRestaurants.length;i++){
        const theReviews =await getReviewsByRestaurantId(theRestaurants[i]._id);
        if (!theReviews) throw "No reviews found.";
        for(let j=0;j<theReviews.length;j++){
            if(theReviews[j]._id===id){
                let deleteReviewInRestaurant=await restaurantsCollection.update(
                    {_id:theRestaurants[i]._id},
                    {$pull:{'R_review':{_id:ObjectId(id)}}}
                )
                if(deleteReviewInRestaurant.deleteCount===0) throw "Could not delete the review.";
            }
        }    
    }
    return "{delete review:true}";
}

module.exports={getReviewsByUserId,addRatingForAll,getRating,getReviewsByRestaurantId,getReviewByreviewId,getSandwiches,getCoffeeAndTea,getItalian,getBranch,getAmerican,getChinese,getDelis,getPizza,getBars,getAverageLike,classifyCuisines,gatherCuisines,mappingCuisines,addReview,updateReview,deleteReview};