const restaurantsRoutes=require("./restaurants");
const reviewsRoutes=require("./reviews");


const constructorMethod = (app) => {
    app.use("/reviews",reviewsRoutes);
    app.use("/restaurants",restaurantsRoutes);
    
    app.use("*", (req, res) => {
        res.status(404).json({error:"Route Not Found"});
    });

};


module.exports = constructorMethod;