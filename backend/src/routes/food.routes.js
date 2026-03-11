const express = require("express");
const { authFoodPartnermiddleware, authUserMiddleware, authAnyMiddleware } = require("../middleware/auth.middlware");
const router = express.Router();
const multer = require("multer");
const { createFood, getfoodItems, deleteFoodVideo, likeFood, saveFood, getSavedFoods } = require("../controllers/food.controller");

const upload = multer({
    storage: multer.memoryStorage(),
})
//post api to upload video and create food item
router.post("/", authFoodPartnermiddleware, upload.single("video"), createFood)

//get api for all users and partners to get all food items 
router.get("/", authAnyMiddleware, getfoodItems)

//delete api for food partners to delete their own specific video reel
router.delete("/:id", authFoodPartnermiddleware, deleteFoodVideo);

//api for liking the food by user
router.post("/like", authUserMiddleware, likeFood);

//api for saving the food by user
router.post("/save", authUserMiddleware, saveFood);
router.get("/saved", authUserMiddleware, getSavedFoods);

module.exports = router;