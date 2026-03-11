const foodPartnerModel = require('../models/foodPartner.model');
const foodModel = require('../models/food.model');

const jwt = require('jsonwebtoken');

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    // Determine if the person requesting is the owner of this profile
    let isOwner = false;
    const token = req.cookies?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // If the logged in user's ID string matches the profile ID
            if (decoded.id === foodPartnerId.toString()) {
                isOwner = true;
            }
        } catch (error) {
            // Token might be expired or invalid, default to false
        }
    }

    res.status(200).json({
        message: "Food partner retrieved successfully",
        success: true,
        ...foodPartner.toObject(), // Put name, address directly on root
        videos: foodItemsByFoodPartner,
        isOwner: isOwner,

        // Keeping foodPartner nested object for backwards compatibility 
        // in case other parts of your app reply on this exact structure
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    });
}

// 1. We create the actual update function taking REQ (request) and RES (response)
async function updateFoodPartnerProfile(req, res) {
    const foodPartnerId = req.params.id;

    // 2. Destructure exactly what we are allowed to update from req.body (sent by frontend axios.put)
    const { RestaurantName, ownerName, address } = req.body;

    try {
        // OPTIONAL SECURITY Check: Ensure the person logged in matches the profile being edited
        if (!req.foodPartner || req.foodPartner._id.toString() !== foodPartnerId) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this profile" });
        }

        // 3. Find the Mongoose document by ID and beautifully update it in one step
        // { new: true } automatically returns the updated object back to us!
        const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
            foodPartnerId,
            { RestaurantName, ownerName, address },
            { new: true, runValidators: true }
        );

        if (!updatedPartner) {
            return res.status(404).json({ success: false, message: "Food partner not found" });
        }

        // 4. Send back the happy 200 Success response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            foodPartner: updatedPartner
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

module.exports = {
    getFoodPartnerById,
    updateFoodPartnerProfile
};