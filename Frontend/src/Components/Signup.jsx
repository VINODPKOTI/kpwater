import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const validateSignupForm = (formData) => {
  let valid = true;
  const newErrors = {};

  // Phone number validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(formData.phone_number)) {
    newErrors.phone_number = "Phone number must be 10 digits.";
    valid = false;
  }

  // Password validation
  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
    valid = false;
  }

  // Email validation
  if (!formData.email.includes("@")) {
    newErrors.email = "Please enter a valid email address.";
    valid = false;
  }

  // Name validation
  if (formData.name.trim().length === 0) {
    newErrors.name = "Name is required.";
    valid = false;
  }

  // Address validation
  if (formData.address.trim().length === 0) {
    newErrors.address = "Address is required.";
    valid = false;
  }

  return { valid, newErrors };
};

const Signup = () => {
  const [formData, setFormData] = useState({
    userid: "",
    name: "",
    phone_number: "",
    email: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    address: "",
  });

  const [otpError, setOtpError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate on change
    const { valid, newErrors } = validateSignupForm({
      ...formData,
      [name]: value,
    });
    if (!valid) {
      setErrors(newErrors);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { valid, newErrors } = validateSignupForm(formData);
    if (!valid) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8081/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        // Check if the user exists
        if (data.message === "User already exists") {
          setOtpError("User already exists. Please log in.");
        } else {
          setOtpError(data.message);
        }
        return;
      }
  
      // Proceed if OTP was sent successfully
      setIsOtpSent(true);
      navigate("/otpverify", { state: { formData: { ...formData, userid: uuidv4() } } });
    } catch (error) {
      setOtpError("Server error. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col m-5">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

          <form onSubmit={handleSubmit}>
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

            <div className="mb-4">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
            </div>

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

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

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
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send OTP
            </button>
            {otpError && <p className="text-red-500 text-xs mt-4">{otpError}</p>}

            <button
                  className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => navigate("/signin")} // Navigate to signup page
                >
                  Back to Sign in
                </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;
