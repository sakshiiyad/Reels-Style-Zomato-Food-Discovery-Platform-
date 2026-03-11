const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodPartner.model")
const userModel = require("../models/user.model")

const authFoodPartnermiddleware = async (req, res, next) => {
    console.log("auth middleware called");
    const token = req.cookies.token;
    console.log("token in middleware", token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, please login to continue"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const FoodPartner = await foodPartnerModel.findById(decoded.id)
        if (!FoodPartner) {
            return res.status(401).json({
                success: false,
                message: "food partner not found, please login to continue"
            })
        }
        console.log("food partner in middleware", FoodPartner);
        req.foodPartner = FoodPartner
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token, please login again",
            error: error.message
        })

    }

}

//middleware for protected routes to check if the user is authenticated or not

const authUserMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, please login to continue"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found, please login to continue"
            })
        }
        req.user = user;
        next();

    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid token, please login again",
        })

    }
}

const authAnyMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, please login to continue"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            return next();
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.foodPartner = foodPartner;
            return next();
        }

        return res.status(401).json({
            success: false,
            message: "Account not found, please login to continue"
        })

    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token, please login again",
            error: error.message
        })

    }
}


module.exports = {
    authFoodPartnermiddleware,
    authUserMiddleware,
    authAnyMiddleware
}