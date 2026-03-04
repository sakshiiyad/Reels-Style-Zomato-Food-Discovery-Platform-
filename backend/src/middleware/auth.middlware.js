const jwt=require("jsonwebtoken");
const foodPatnerModel=require("../models/foodPartner.model")
const userModel=require("../models/user.model")
const authFoodPartnermiddleware=async(req,res,next)=>{
    console.log("auth middleware called");
const token=req.cookies.token;
console.log("token in middleware",token);
if(!token){
    return res.status(401).json({
        success:false,
        message:"Unauthorized access, please login to continue"
    })
}
try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const foodPartner=await foodPatnerModel.findById(decoded.id)
    req.foodPartner=foodPartner
    next();

}catch(error){
    return res.status(401).json({
        success:false,
        message:"Invalid token, please login again",
        error:error.message
    })

}

}

//middleware for protected routes to check if the user is authenticated or not

const authUserMiddleware=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized access, please login to continue"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded.id);
        req.user=user;
        next();

    }
    catch(error){
        return res.status(401).json({
            message:"Invalid token, please login again",
        })

    }
}


module.exports={
    authFoodPartnermiddleware,
    authUserMiddleware
}