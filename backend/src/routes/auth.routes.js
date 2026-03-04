const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser,registerfoodPartner,
loginfoodPartner,logoutfoodPartner
}=require("../controllers/auth.controller")

router.post("/user/register", registerUser);
router.post("/user/login",loginUser)
router.get("/user/logout",logoutUser)
router.post("/foodpartner/register", registerfoodPartner);
router.post("/foodpartner/login",loginfoodPartner)
router.get("/foodpartner/logout",logoutfoodPartner)
module.exports = router;