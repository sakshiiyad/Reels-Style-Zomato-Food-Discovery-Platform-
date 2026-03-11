import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React from "react"
import UserLogin from "../pages/auth/UserLogin"
import UserRegister from "../pages/auth/UserRegister"
import PartnerLogin from "../pages/auth/PartnerLogin"
import PartnerRegister from "../pages/auth/PartnerRegister"
import Home from "../pages/general/Home"
import Saved from "../pages/general/Saved"
import FoodUpload from "../pages/food-partner/FoodUpload"
import ChooseRegister from "../pages/auth/ChooseRegister"
import Profile from "../pages/food-partner/Profile"


// Import Cart capabilities
import { CartProvider } from "../context/CartContext"
import Cart from "../pages/general/Cart"

const AppRoutes = () => {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    {/* Redirect root to login for now */}
                    <Route path="/" element={<ChooseRegister />} />

                    {/* User Routes */}
                    <Route path="/login" element={<UserLogin />} />
                    <Route path="/register" element={<UserRegister />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/cart" element={<Cart />} />

                    {/* Partner Routes */}
                    <Route path="/partner/login" element={<PartnerLogin />} />
                    <Route path="/partner/register" element={<PartnerRegister />} />
                    <Route path="/create-food" element={<FoodUpload />} />
                    <Route path="/partner/:id" element={<Profile />} />
                </Routes>
            </Router>
        </CartProvider>
    )
}

export default AppRoutes;