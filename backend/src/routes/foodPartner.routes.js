const express = require("express");
const { authUserMiddleware, authFoodPartnermiddleware } = require("../middleware/auth.middlware");
const { getFoodPartnerById, updateFoodPartnerProfile } = require("../controllers/food-partner.controller");

const router = express.Router();

// The GET endpoint doesn't actually need 'authUserMiddleware' if it's a public store profile, 
// but we leave it as you configured it.
router.get("/:id", getFoodPartnerById);

// 5. Connect the PUT request explicitly to the 'authFoodPartnermiddleware' middleware to ensure 
// ONLY authenticated Food Partners can hit this route!
router.put("/:id", authFoodPartnermiddleware, updateFoodPartnerProfile);

module.exports = router;