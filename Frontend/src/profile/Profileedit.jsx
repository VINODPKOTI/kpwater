import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const validateProfileForm = (formData) => {
  let valid = true;
  const newErrors = {};

  // Phone number validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(formData.phone_number)) {
    newErrors.phone_number = "Phone number must be 10 digits.";
    valid = false;
  }

  // Password validation (optional)
  if (formData.password && formData.password.length < 6) {
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

const Profileedit = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "", // Now handling password
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userID");

    const fetchUserData = async () => {
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/user/${userId}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();

        // Set form data with fetched user data
        setFormData({
          name: data.name || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          password: "", // Leave password empty for security reasons
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate on change
    const { valid, newErrors } = validateProfileForm({ ...formData, [name]: value });
    if (!valid) {
      setErrors(newErrors);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { valid, newErrors } = validateProfileForm(formData);
    if (valid) {
      try {
        const userId = localStorage.getItem("userID");
        
        const response = await fetch(`http://localhost:8081/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Profile updated successfully", data);
          navigate('/profileview');
        } else {
          console.log("Profile update failed", data.message);
        }
      } catch (error) {
        console.error("Error updating the profile:", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex flex-col m-5">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

          <form onSubmit={handleSubmit}>
            {/* Form inputs */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
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
                className="mt-1 block w-full border border-gray-300 rounded-md"
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
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Save Changes
            </button>
          </form>

          <div className="flex justify-center mt-6">
            <p className="text-center text-sm text-gray-600">Go back to your profile?</p>
            <button
              className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-md"
              onClick={() => navigate('/profileview')}
            >
              Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profileedit;
