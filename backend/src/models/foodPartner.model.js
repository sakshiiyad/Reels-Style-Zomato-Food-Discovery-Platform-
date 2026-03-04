const mongoose = require("mongoose");
const schema=mongoose.Schema;

const foodPartnerSchema=new schema({
    RestaurantName:{
        type:String,
        required:true
    },
    ownerName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    }
    
})
const foodPartner=mongoose.model("foodPartner",foodPartnerSchema);

module.exports=foodPartner;