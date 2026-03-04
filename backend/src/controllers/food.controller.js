const { uploadFile } = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const foodModel = require("../models/food.model");

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

const getfoodItems=async(req,res)=>{
    try{
        const foodItems=await foodModel.find({});
        return res.status(200).json({
            success:true,
            message:"Food items fetched successfully",
            foodItems
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:error.message
        })
    }
}

module.exports = {
  createFood,
  getfoodItems
}