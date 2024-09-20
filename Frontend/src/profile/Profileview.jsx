import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Assuming you're using react-router-dom for navigation

const View = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get userId from localStorage
    const userId = localStorage.getItem("userID");
    console.log(userId);
    if (userId) {
      // Fetch user details using the userId
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8081/user/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserDetails(data); // Set user details in state
            console.log(data);
          } else {
            const errData = await response.json();
            setError(errData.message || "Failed to fetch user details");
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
          setError("An error occurred while fetching user details.");
        }
      };

      fetchUserDetails();
    } else {
      setError("User ID not found in local storage.");
    }
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-center">User Details</h1>
        
        {/* Table for User Details */}
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Options</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 transition-all duration-150">
              <td className="py-3 px-4 font-medium">Name</td>
              <td className="py-3 px-4">{userDetails.name}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-all duration-150">
              <td className="py-3 px-4 font-medium">Email</td>
              <td className="py-3 px-4">{userDetails.email}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-all duration-150">
              <td className="py-3 px-4 font-medium">Phone Number</td>
              <td className="py-3 px-4">{userDetails.phone_number}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-all duration-150">
              <td className="py-3 px-4 font-medium">Address</td>
              <td className="py-3 px-4">{userDetails.address}</td>
            </tr>
            {/* Add more fields as needed */}
          </tbody>
        </table>

        {/* Link to edit profile */}
        <div className="mt-6 text-center">
          <Link
            to="/profileedit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default View;
