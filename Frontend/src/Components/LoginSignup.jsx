import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
      valid = false;
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    // Email validation (for signup)
    if (!isLogin && !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Name validation (for signup)
    if (!isLogin && formData.name.trim().length === 0) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const endpoint = isLogin ? "http://localhost:3000/login" : "http://localhost:3000/signup";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(isLogin ? "Login successful" : "Signup successful", data);
          if (isLogin) {
            navigate('/cart'); // Redirect to cart page on login success
          } else {
            setIsLogin(true); // Switch to login page after signup
          }
        } else {
          console.log(isLogin ? "Login failed" : "Signup failed", data.message);
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    }
  };

  return (
    <div className="flex flex-col m-5">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
          <h1 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Sign In" : "Sign Up"}</h1>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="flex justify-center mt-6">
            <button
              className={`mr-2 ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-black"} py-2 px-4 rounded-md`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`ml-2 ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-black"} py-2 px-4 rounded-md`}
              onClick={() => setIsLogin(false)}
            >
              Signup
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginSignup;
