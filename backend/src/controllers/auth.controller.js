const User = require("../models/user.model");
const foodPartner=require("../models/foodPartner.model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");  


const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"}) 
        }
        //check if user exists or not in db
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        //hash the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        //save the user in db
        const newUser =await User.create({
            name,
            email,
            password:hashedPassword
        })
        

        //generate token
        const jwtToken=jwt.sign(
            {id:newUser._id},
           process.env.JWT_SECRET,
           { "expiresIn":"7d"}
        )
        res.cookie("token",jwtToken)
        
        return res.status(201).json({  
            success:true,
            message:"User registered successfully",
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email
            },
            
           


    })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:err.message
        })
    }
}
const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
}
        //check if user exists or not in db
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }
        //compare the password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                sucess:false,
                message:"Invalid credentials, please try again"

            })

        }
        const token=jwt.sign(
            {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
        )
    
    res.cookie("token",token)
    return res.status(200).json({
        success:true,
        message:"User logged in successfully",
        user:{
            id:user._id,
            email:user.email,
            name:user.name
        }    
    })
    } 
    
    catch(err){
        return res.status(500).json({
            success:false, 
            message:"Something went wrong",
            error:err.message 
        })
    }
}
const logoutUser=async(req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })

    }catch(error){
            return res.status(500).json({
                success:false,
                message:"Something went wrong",
                error:error.message
            })

    }
}

const registerfoodPartner=async(req,res)=>{
    const {RestaurantName,ownerName,email,password}=req.body;
    try{
        if(!RestaurantName ||!ownerName|| !email || !password){
            return res.status(400).json({message:"Please fill all the fields"}) 
        }
        //check if user exists or not in db
        const foodpartner=await foodPartner.findOne({email});
        if(foodpartner){
            return res.status(400).json({
                success:false,
                message:"foodPartner already exists"
            })
        }
        //hash the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        //save the user in db
        const newfoodPartner =await foodPartner.create({
            RestaurantName,
            ownerName,
            email,
            password:hashedPassword
        })
        

        //generate token
        const jwtToken=jwt.sign(
            {id:newfoodPartner._id},
           process.env.JWT_SECRET,
           { "expiresIn":"7d"}
        )
        res.cookie("token",jwtToken)
        
        return res.status(201).json({  
            success:true,
            message:"foodPartner registered successfully",
            foodPartner:{
                id:newfoodPartner._id,
                name:newfoodPartner.name,
                email:newfoodPartner.email
            },
            
           


    })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:err.message
        })
    }
}
const loginfoodPartner=async(req,res)=>{
    const{email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
}
        //check if user exists or not in db
        const foodpartner=await foodPartner.findOne({email});
        if(!foodpartner){
            return res.status(400).json({
                success:false,
                message:"foodPartner does not exist"
            })
        }
        //compare the password
        const isMatch=await bcrypt.compare(password,foodpartner.password);
        if(!isMatch){
            return res.status(400).json({
                sucess:false,
                message:"Invalid credentials, please try again"

            })

        }
        const token=jwt.sign(
            {id:foodpartner._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
        )
    
    res.cookie("token",token)
    return res.status(200).json({
        success:true,
        message:"foodPartner logged in successfully",
        foodPartner:{
            id:foodpartner._id,
            email:foodpartner.email,
            name:foodpartner.ownerName
        }    
    })
    } 
    
    catch(err){
        return res.status(500).json({
            success:false, 
            message:"Something went wrong",
            error:err.message 
        })
    }
}

const logoutfoodPartner=async(req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({
            success:true,
            message:"foodPartner logged out successfully"
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
    registerUser,
    loginUser,
    logoutUser,
    registerfoodPartner,
    loginfoodPartner,
    logoutfoodPartner

}   