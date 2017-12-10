const restaurantsRoutes=require("./restaurants");
const reviewsRoutes=require("./reviews");


const constructorMethod = (app) => {
    app.use("/reviews",reviewsRoutes);
    //Make sure /restaurants is private.
    app.use("/restaurants",require('connect-ensure-login').ensureLoggedIn('/login'),restaurantsRoutes);


    
    app.use("*", (req, res) => {
        res.status(404).json({error:"Route Not Found"});
    });

};


module.exports = constructorMethod;