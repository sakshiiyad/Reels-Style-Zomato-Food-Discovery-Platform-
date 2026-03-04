


const express = require('express');
const app = express();
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const foodRoutes = require("../src/routes/food.routes")
const cors = require("cors");



app.use(express.json());
app.use(cookieParser()); //to read cookies data 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
//auth routes
app.use("/api/auth", authRoutes);
//food routes
app.use("/api/food", foodRoutes)




module.exports = app;
