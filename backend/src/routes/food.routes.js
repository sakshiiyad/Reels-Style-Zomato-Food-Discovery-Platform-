const express=require("express");
const { authFoodPartnermiddleware, authUserMiddleware } = require("../middleware/auth.middlware");
const router=express.Router();
const multer=require("multer");
const { createFood,getfoodItems} = require("../controllers/food.controller");

const upload=multer({
    storage:multer.memoryStorage(),
})
//post api to upload video and create food item
router.post("/",authFoodPartnermiddleware,upload.single("video"),createFood)
//get api for all users to get all food items 
router.get("/",authUserMiddleware,getfoodItems)


module.exports=router;