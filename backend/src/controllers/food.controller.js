const { uploadFile } = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/saves.model");

const createFood = async (req, res) => {
  try {
    console.log("food controller called");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }


    const base64Video = req.file.buffer.toString("base64");


    const fileName = `${uuid()}_${req.file.originalname}`;

    // ✅ Upload to ImageKit
    const fileUploadResult = await uploadFile(base64Video, fileName);

    // ✅ Append transformation for playback
    const videoUrl = `${fileUploadResult.url}?tr=f-auto`;

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      video: videoUrl,
      foodPartner: req.foodPartner._id,
    });

    return res.status(201).json({
      success: true,
      message: "Food item created successfully",
      foodItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getfoodItems = async (req, res) => {
  try {
    const user = req.user; // Might be undefined if foodPartner is making the request
    const foodItemsData = await foodModel.find({}).lean();

    let foodItems = foodItemsData;

    // Only fetch likes and saves if it's a regular user making the request
    if (user) {
      const userLikes = await likeModel.find({ user: user._id }).lean();
      const userSaves = await saveModel.find({ user: user._id }).lean();

      const likedIds = new Set(userLikes.map(l => l.food.toString()));
      const savedIds = new Set(userSaves.map(s => s.food.toString()));

      foodItems = foodItemsData.map(item => ({
        ...item,
        isLiked: likedIds.has(item._id.toString()),
        isSaved: savedIds.has(item._id.toString()),
      }));
    } else {
      // For food partners viewing the feed, we don't calculate isLiked/isSaved.
      foodItems = foodItemsData.map(item => ({
        ...item,
        isLiked: false,
        isSaved: false,
      }));
    }

    return res.status(200).json({
      success: true,
      message: "Food items fetched successfully",
      foodItems
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    })
  }
}

const deleteFoodVideo = async (req, res) => {
  try {
    const videoId = req.params.id;

    // 1. Find the video and verify it exists in the database
    const foodItem = await foodModel.findById(videoId);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    // 2. SECURITY: Ensure the foodPartner trying to delete the video is the actual owner
    if (foodItem.foodPartner.toString() !== req.foodPartner._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this video" });
    }

    // 3. Delete it from the local database forever
    // (Note: To delete the video off ImageKit cloud storage itself, you would add cloud deletion logic here)
    await foodModel.findByIdAndDelete(videoId);

    return res.status(200).json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const likeFood = async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;
  try {
    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId
    })
    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        user: user._id,
        food: foodId
      })
      await foodModel.findByIdAndUpdate(foodId,
        {
          $inc: { likecount: -1 }
        })
      return res.status(200).json({
        message: "Food unliked successfully"
      })

    }
    const like = await likeModel.create({
      user: user._id,
      food: foodId
    })
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likecount: 1 }
    })
    res.status(200).json({
      message: "Food liked successfully",
      like
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    })
  }
}

const saveFood = async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;
  try {
    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId
    });
    if (isAlreadySaved) {
      await saveModel.deleteOne({
        user: user._id,
        food: foodId
      });
      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savecount: -1 }
      });
      return res.status(200).json({
        message: "Food unsaved successfully"
      });
    }
    const save = await saveModel.create({
      user: user._id,
      food: foodId
    });
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { savecount: 1 }
    });
    res.status(200).json({
      message: "Food saved successfully",
      save
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

const getSavedFoods = async (req, res) => {
  try {
    const user = req.user;
    const userSaves = await saveModel.find({ user: user._id }).populate('food').lean();

    const userLikes = await likeModel.find({ user: user._id }).lean();
    const likedIds = new Set(userLikes.map(l => l.food.toString()));

    // Filter out null foods just in case the food was deleted
    const validSaves = userSaves.filter(s => s.food != null);

    const savedFoods = validSaves.map(s => ({
      ...s.food,
      isLiked: likedIds.has(s.food._id.toString()),
      isSaved: true
    }));

    return res.status(200).json({
      success: true,
      message: "Saved foods fetched successfully",
      foodItems: savedFoods
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

module.exports = {
  createFood,
  getfoodItems,
  deleteFoodVideo,
  likeFood,
  saveFood,
  getSavedFoods
}