const express = require('express');
const app = express();
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const foodRoutes = require("../src/routes/food.routes")
const cors = require("cors");
const foodPartnerRoutes=require("../src/routes/foodPartner.routes")
const path = require("path")

app.use(express.json());
app.use(cookieParser());

// during deployment change origin
app.use(cors({
  origin: true,
  credentials: true
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/foodpartner", foodPartnerRoutes);

// -------- SERVE FRONTEND --------

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "dist")));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname1, "dist", "index.html"));
});

module.exports = app;