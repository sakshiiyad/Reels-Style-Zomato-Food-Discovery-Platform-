import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import React from "react"
import UserLogin from "../pages/auth/UserLogin"
import UserRegister from "../pages/auth/UserRegister"
import PartnerLogin from "../pages/auth/PartnerLogin"
import PartnerRegister from "../pages/auth/PartnerRegister"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Redirect root to login for now */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* User Routes */}
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />


                {/* Partner Routes */}
                <Route path="/partner/login" element={<PartnerLogin />} />
                <Route path="/partner/register" element={<PartnerRegister />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;