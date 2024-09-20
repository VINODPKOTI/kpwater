import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Footer from "./Components/Footer";
import Cards from "./Components/Cards";
import About from "./Components/About";
import Service from "./Components/Services";
import Cart from "./Components/Cart";
import Orders from "./Components/Orders";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Home from "./admin/Home";
import ProtectedRoute from "./Components/ProtectedRoute"; // For protected routes
import Profileview from "./profile/Profileview";
import Profileedit from "./profile/Profileedit";
import Otpverify from "./Components/Otpverify";
import style from "./styles/style.css"


export default function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-emerald-400 pt-16 ">

          <Nav /> {/* Navbar remains visible on all pages */}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Cards />} /> {/* Default page */}
            <Route path="/about" element={<About />} /> {/* About page */}
            <Route path="/services" element={<Service />} /> {/* Services page */}
            <Route path="/cart" element={<Cart />} /> {/* Cart page */}
            <Route path="/signup" element={<Signup />} /> {/* Signup page */}
            <Route path="/signin" element={<Signin />} /> {/* Signin page */}
            <Route path="/otpverify" element={<Otpverify />} /> {/* Signin page */}
            


            
            {/* Protected Routes */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route path="/profileview" element={
                <ProtectedRoute isAdminRequired={true}> {/* Only admins can access */}
                  <Profileview />
                </ProtectedRoute>
              } /> 
            <Route path="/profileedit" element={
                <ProtectedRoute isAdminRequired={true}> {/* Only admins can access */}
                  <Profileedit />
                </ProtectedRoute>
              } /> 
            <Route
              path="/home"
              element={
                <ProtectedRoute isAdminRequired={true}> {/* Only admins can access */}
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer /> {/* Footer remains visible on all pages */}
        </div>
      </Router>
    </>
  );
}
