import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const validateSigninForm = (formData) => {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

  if (!emailRegex.test(formData.email)) {
    newErrors.email = "Invalid email address.";
  }

  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
  }

  return {
    valid: Object.keys(newErrors).length === 0,
    newErrors,
  };
};

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for a token (or any login indicator) in localStorage
    const token = localStorage.getItem("authToken");
    if (token || localStorage.getItem("userID")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate form on change
    const { valid, newErrors } = validateSigninForm({
      ...formData,
      [name]: value,
    });
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { valid, newErrors } = validateSigninForm(formData);
  
    if (valid) {
      try {
        const response = await fetch("http://localhost:8081/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Handle successful login
          localStorage.setItem("userID", data.userId);
          localStorage.setItem("userName", data.userName);
          setIsLoggedIn(true);
          if (data.userId === 'd95f52c1-84b3-4acb-92f2-5977a4e2cc06') {
            navigate("/orders");
          } else {
            navigate("/cart");
          }
        } else {
          // Set error messages based on response
          setErrors((prevErrors) => ({
            email: data.message.includes("User not found") ? data.message : "",
            password: data.message.includes("password") ? data.message : "",
          }));
        }
      } catch (error) {
        setErrors({ email: "Server error. Please try again.", password: "" });
      }
    } else {
      setErrors(newErrors);
    }
  };
  

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/signin"); // Optionally redirect to signin page
  };

  return (
    <div className="flex flex-col m-5">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
          {isLoggedIn ? (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">
                Welcome Back! {localStorage.getItem("userName")}
              </h1>
              <button
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign In
                </button>
              </form>

              {/* Forgot Password Link */}
              <div className="flex justify-center mt-4">
                <button
                  className="text-sm text-blue-600 hover:underline focus:outline-none"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign up section */}
              <div className="flex justify-center items-center mt-6">
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?
                </p>
                <button
                  className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => navigate("/signup")} // Navigate to signup page
                >
                  Create New Account
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Signin;
